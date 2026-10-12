import * as THREE from "three";
import gsap from "gsap";
import { C, Lines, Trees, baseBox, camTo, mesh, outline, pop, rise, rnd, std, type Builder, type Stage, type V3 } from "../common";

/**
 * One building, one footprint, one camera family, from start to finish. Every stage adds to the previous one:
 * survey → footprint & wireframe proposal → excavation → foundations → frame (3 storeys) → instanced brickwork →
 * windows & doors → finishing → landscaping.
 */

const BX = 7; // half-width of the building (x)
const BZ = 4.5; // half-depth (z)
const STOREYS = 3;
const SH = 3.2; // storey height
const GROUND = 0.3; // top of ground-floor slab
const PIT = 1.5;
const TOP = GROUND + STOREYS * SH; // roof slab top

const COLS_X = [-6.5, -2.2, 2.2, 6.5];
const COLS_Z = [-4, 0, 4];

type Opening = { wall: "front" | "back" | "left" | "right"; c: number; w: number; y0: number; y1: number; door?: boolean };

function openings(): Opening[] {
  const o: Opening[] = [];
  for (let s = 0; s < STOREYS; s++) {
    const y0 = GROUND + s * SH + 0.85;
    const y1 = y0 + 1.5;
    for (const c of [-4.3, 4.3]) o.push({ wall: "front", c, w: 2.2, y0, y1 });
    if (s === 0) o.push({ wall: "front", c: 0, w: 1.5, y0: GROUND, y1: GROUND + 2.35, door: true });
    else o.push({ wall: "front", c: 0, w: 2.6, y0, y1 });
    for (const c of [-2.2, 2.2]) {
      o.push({ wall: "left", c, w: 1.6, y0, y1 });
      o.push({ wall: "right", c, w: 1.6, y0, y1 });
    }
    o.push({ wall: "back", c: -3.5, w: 1.6, y0, y1 });
    o.push({ wall: "back", c: 3.5, w: 1.6, y0, y1 });
  }
  return o;
}

const WALLS = {
  front: { origin: [-BX + 0.1, BZ - 0.1] as [number, number], dir: [1, 0] as [number, number], len: 2 * BX - 0.2, rotY: 0, center: 0 },
  back: { origin: [-BX + 0.1, -BZ + 0.1] as [number, number], dir: [1, 0] as [number, number], len: 2 * BX - 0.2, rotY: 0, center: 0 },
  left: { origin: [-BX + 0.1, -BZ + 0.1] as [number, number], dir: [0, 1] as [number, number], len: 2 * BZ - 0.2, rotY: Math.PI / 2, center: 0 },
  right: { origin: [BX - 0.1, -BZ + 0.1] as [number, number], dir: [0, 1] as [number, number], len: 2 * BZ - 0.2, rotY: Math.PI / 2, center: 0 },
};

export const buildConstruction: Builder = (ctx) => {
  const k = 0.64;
  const T = (t: number) => t * k;
  const tl = gsap.timeline({ paused: true });
  const { scene } = ctx;

  ctx.sun.position.set(-30, 46, 36);
  ctx.sun.intensity = 1.9;
  const sc = ctx.sun.shadow.camera;
  sc.left = -34;
  sc.right = 34;
  sc.top = 34;
  sc.bottom = -34;
  sc.far = 160;
  sc.updateProjectionMatrix();

  // ── ground & site ──
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), std(C.bg));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.02;
  ground.receiveShadow = true;
  scene.add(ground);

  const SITE_X = 24;
  const SITE_Z = 17;
  const PX = BX + 1.6; // pit half extents (working space around the building)
  const PZ = BZ + 1.6;
  const shape = new THREE.Shape();
  shape.moveTo(-SITE_X, -SITE_Z);
  shape.lineTo(SITE_X, -SITE_Z);
  shape.lineTo(SITE_X, SITE_Z);
  shape.lineTo(-SITE_X, SITE_Z);
  shape.closePath();
  const hole = new THREE.Path();
  hole.moveTo(-PX, -PZ);
  hole.lineTo(-PX, PZ);
  hole.lineTo(PX, PZ);
  hole.lineTo(PX, -PZ);
  hole.closePath();
  shape.holes.push(hole);
  const siteMat = std(C.bg);
  const site = new THREE.Mesh(new THREE.ShapeGeometry(shape), siteMat);
  site.rotation.x = -Math.PI / 2; // shape y → world -z; the layout is symmetric so this is safe
  site.position.y = 0.005;
  site.receiveShadow = true;
  scene.add(site);
  const soil = new THREE.Color(0xd9cdb4);
  tl.to(siteMat.color, { r: soil.r, g: soil.g, b: soil.b, duration: T(1.4) }, T(0.5));

  // cover over the (future) pit so the plot reads as flat, undisturbed ground
  const coverMat = std(0xd9cdb4, { transparent: true });
  const cover = new THREE.Mesh(new THREE.PlaneGeometry(PX * 2, PZ * 2), coverMat);
  cover.rotation.x = -Math.PI / 2;
  cover.position.y = 0.006;
  cover.receiveShadow = true;
  scene.add(cover);
  coverMat.opacity = 0;
  tl.to(coverMat, { opacity: 1, duration: T(1.4) }, T(0.5));

  // ── survey boundary & stakes ──
  const boundary = new Lines().rect(-SITE_X, -SITE_Z, SITE_X, SITE_Z, 0.04);
  scene.add(boundary.build(C.charcoal, 0.95));
  boundary.draw(tl, T(1.0), T(2.6));
  const stakeMat = std(C.brass);
  for (const [i, [x, z]] of (
    [
      [-SITE_X, -SITE_Z],
      [SITE_X, -SITE_Z],
      [SITE_X, SITE_Z],
      [-SITE_X, SITE_Z],
    ] as [number, number][]
  ).entries()) {
    const s = mesh(baseBox(0.5, 1.8, 0.5), stakeMat, [x, 0, z]);
    scene.add(s);
    rise(tl, s, T(1.4 + i * 0.5), T(0.6));
  }
  const grid = new Lines();
  for (let x = -SITE_X; x <= SITE_X; x += 4) grid.seg([x, 0.03, -SITE_Z], [x, 0.03, SITE_Z]);
  for (let z = -SITE_Z; z <= SITE_Z; z += 4) grid.seg([-SITE_X, 0.03, z], [SITE_X, 0.03, z]);
  scene.add(grid.build(C.charcoal, 0.1));
  grid.draw(tl, T(1.2), T(2.2), "power1.out");

  // ── footprint & wireframe proposal ──
  const fp = new Lines().rect(-BX, -BZ, BX, BZ, 0.06);
  fp.poly(
    [
      [-BX - 1, 0.06, BZ + 1.4],
      [BX + 1, 0.06, BZ + 1.4],
    ],
    false,
  );
  scene.add(fp.build(C.charcoal, 1));
  fp.draw(tl, T(4.0), T(1.4));
  const ghost = new THREE.Mesh(baseBox(2 * BX, TOP + 0.4, 2 * BZ), std(0xffffff, { transparent: true, opacity: 0 }));
  ghost.castShadow = false;
  const ghostEdges = new THREE.LineSegments(new THREE.EdgesGeometry(ghost.geometry), new THREE.LineBasicMaterial({ color: C.brass, transparent: true, opacity: 1 }));
  ghost.add(ghostEdges);
  scene.add(ghost);
  rise(tl, ghost, T(5.0), T(2.4), "power2.inOut");
  tl.to(ghostEdges.material as THREE.Material, { opacity: 0.18, duration: T(1.2) }, T(11.2));

  // ── excavation ──
  const wallSoil = std(0xbfae90);
  const pitWalls = new THREE.Group();
  const pw = (w: number, d: number, x: number, z: number) => {
    const g = new THREE.BoxGeometry(w, PIT, d);
    g.translate(0, -PIT / 2, 0);
    const m = mesh(g, wallSoil, [x, 0, z], false);
    pitWalls.add(m);
  };
  pw(2 * PX, 0.2, 0, -PZ);
  pw(2 * PX, 0.2, 0, PZ);
  pw(0.2, 2 * PZ, -PX, 0);
  pw(0.2, 2 * PZ, PX, 0);
  pitWalls.visible = false;
  pitWalls.scale.y = 0.001;
  scene.add(pitWalls);
  const pitFloor = mesh(new THREE.PlaneGeometry(2 * PX, 2 * PZ), std(0xaa9a7e), [0, -PIT, 0], false);
  pitFloor.rotation.x = -Math.PI / 2;
  pitFloor.visible = false;
  scene.add(pitFloor);
  const dig = T(8.0);
  tl.set([pitWalls, pitFloor], { visible: true }, dig);
  tl.to(coverMat, { opacity: 0, duration: T(1.0) }, dig);
  tl.to(pitWalls.scale, { y: 1, duration: T(2.0), ease: "power2.inOut" }, dig);
  const layout = new Lines();
  for (const x of COLS_X) layout.seg([x, -PIT + 0.03, -BZ], [x, -PIT + 0.03, BZ]);
  for (const z of COLS_Z) layout.seg([-BX + 0.5, -PIT + 0.03, z], [BX - 0.5, -PIT + 0.03, z]);
  scene.add(layout.build(C.charcoal, 0.8));
  layout.draw(tl, T(9.6), T(1.4));
  const piles: THREE.Mesh[] = [];
  for (const [x, z, s] of [
    [-12.5, 6, 2.2],
    [13, -7.5, 1.8],
    [-14, -5, 1.4],
  ] as V3[]) {
    const m = mesh(new THREE.ConeGeometry(s, s * 0.8, 9), wallSoil, [x, (s * 0.8) / 2, z]);
    piles.push(m);
    scene.add(m);
    pop(tl, m, dig + T(0.6), T(0.9), "power2.out");
  }

  // ── foundations ──
  const concrete = std(0xcfcbc2);
  const footings: THREE.Mesh[] = [];
  let fi = 0;
  for (const x of COLS_X)
    for (const z of COLS_Z) {
      const f = mesh(baseBox(1.5, 0.5, 1.5), concrete, [x, -PIT, z]);
      outline(f, C.charcoal, 0.35);
      scene.add(f);
      footings.push(f);
      rise(tl, f, T(11.0) + fi * T(0.1), T(0.6));
      fi++;
    }
  const stumps: THREE.Mesh[] = [];
  fi = 0;
  for (const x of COLS_X)
    for (const z of COLS_Z) {
      const g = baseBox(0.42, PIT + GROUND - 0.5, 0.42);
      const s = mesh(g, concrete, [x, -PIT + 0.5, z]);
      scene.add(s);
      stumps.push(s);
      rise(tl, s, T(11.9) + fi * T(0.06), T(0.5));
      fi++;
    }
  const slab0 = mesh(baseBox(2 * BX + 0.4, 0.3, 2 * BZ + 0.4), concrete, [0, GROUND - 0.3, 0]);
  outline(slab0, C.charcoal, 0.4);
  scene.add(slab0);
  rise(tl, slab0, T(12.8), T(1.0));

  // ── crane ──
  const crane = new THREE.Group();
  const craneMat = std(C.brass, { roughness: 0.55, metalness: 0.2 });
  const mast = mesh(baseBox(0.55, 17, 0.55), craneMat, [0, 0, 0]);
  outline(mast, C.charcoal, 0.4);
  const jib = new THREE.Group();
  jib.position.y = 17;
  jib.add(mesh(new THREE.BoxGeometry(17, 0.35, 0.5), craneMat, [3.5, 0.2, 0]), mesh(new THREE.BoxGeometry(2.4, 1.0, 1.0), std(C.concrete), [-4.6, -0.2, 0]));
  jib.add(mesh(new THREE.CylinderGeometry(0.008, 0.008, 6, 4), std(C.charcoal), [9.5, -3, 0], false));
  crane.add(mast, jib);
  crane.position.set(-13, 0, -7.5);
  scene.add(crane);
  rise(tl, crane, T(13.6), T(1.6), "power2.out");
  jib.rotation.y = 0.6;
  tl.to(jib.rotation, { y: 2.4, duration: T(16), ease: "sine.inOut" }, T(15));

  // ── frame: per storey columns → beams → slab ──
  const frameMat = std(0xd6d1c7);
  const storeyGroups: THREE.Mesh[][] = [];
  for (let s = 0; s < STOREYS; s++) {
    const base = GROUND + s * SH;
    const t0 = T(14.8) + s * T(2.4);
    const cols: THREE.Mesh[] = [];
    let ci = 0;
    for (const x of COLS_X)
      for (const z of COLS_Z) {
        const c = mesh(baseBox(0.42, SH - 0.3, 0.42), frameMat, [x, base, z]);
        outline(c, C.charcoal, 0.3);
        scene.add(c);
        cols.push(c);
        rise(tl, c, t0 + ci * T(0.05), T(0.7), "power2.out");
        ci++;
      }
    const beamY = base + SH - 0.7;
    const beams = new THREE.Group();
    for (const z of COLS_Z) beams.add(mesh(new THREE.BoxGeometry(2 * BX - 0.5, 0.4, 0.3), frameMat, [0, beamY + 0.2, z]));
    for (const x of COLS_X) beams.add(mesh(new THREE.BoxGeometry(0.3, 0.4, 2 * BZ - 0.5), frameMat, [x, beamY + 0.2, 0]));
    beams.visible = false;
    beams.scale.set(0.001, 1, 0.001);
    scene.add(beams);
    tl.set(beams, { visible: true }, t0 + T(0.9));
    tl.to(beams.scale, { x: 1, z: 1, duration: T(0.7), ease: "power2.out" }, t0 + T(0.9));
    const slab = mesh(baseBox(2 * BX + 0.4, 0.3, 2 * BZ + 0.4), frameMat, [0, base + SH - 0.3, 0]);
    outline(slab, C.charcoal, 0.4);
    scene.add(slab);
    slab.visible = false;
    slab.scale.set(0.001, 1, 0.001);
    tl.set(slab, { visible: true }, t0 + T(1.4));
    tl.to(slab.scale, { x: 1, z: 1, duration: T(0.9), ease: "power3.out" }, t0 + T(1.4));
    storeyGroups.push([...cols, slab]);
  }

  // ── scaffolding (front, left, right), present during enclosure ──
  const scaf = new Lines();
  const off = 1.3;
  const top = TOP + 1.2;
  const faces: [V3, V3][] = [
    [[-BX - off, 0, BZ + off], [BX + off, 0, BZ + off]],
    [[-BX - off, 0, -BZ - off], [-BX - off, 0, BZ + off]],
    [[BX + off, 0, -BZ - off], [BX + off, 0, BZ + off]],
  ];
  for (const [a, b] of faces) {
    const len = Math.hypot(b[0] - a[0], b[2] - a[2]);
    const n = Math.round(len / 2.4);
    for (let i = 0; i <= n; i++) {
      const x = a[0] + ((b[0] - a[0]) * i) / n;
      const z = a[2] + ((b[2] - a[2]) * i) / n;
      scaf.seg([x, 0.05, z], [x, top, z]);
    }
    for (let y = 1.6; y <= top; y += 1.6) scaf.seg([a[0], y, a[2]], [b[0], y, b[2]]);
    for (let i = 0; i < n; i += 2) {
      const x0 = a[0] + ((b[0] - a[0]) * i) / n;
      const z0 = a[2] + ((b[2] - a[2]) * i) / n;
      const x1 = a[0] + ((b[0] - a[0]) * (i + 1)) / n;
      const z1 = a[2] + ((b[2] - a[2]) * (i + 1)) / n;
      scaf.seg([x0, 0.05, z0], [x1, 1.6 * 2, z1]);
    }
  }
  scene.add(scaf.build(C.charcoal, 0.75));
  scaf.draw(tl, T(22.2), T(1.8), "power1.inOut");

  // ── brickwork: one InstancedMesh, revealed bottom-up ──
  const ops = openings();
  const BL = 0.4;
  const BH = 0.19;
  const BT = 0.2;
  const coursesPerStorey = Math.floor((SH - 0.3) / BH);
  type Brick = { x: number; y: number; z: number; rot: number; shade: number; order: number };
  const bricks: Brick[] = [];
  for (let s = 0; s < STOREYS; s++) {
    for (let c = 0; c < coursesPerStorey; c++) {
      const y = GROUND + s * SH + c * BH + BH / 2;
      for (const [name, w] of Object.entries(WALLS) as [keyof typeof WALLS, (typeof WALLS)[keyof typeof WALLS]][]) {
        const n = Math.floor(w.len / BL);
        for (let i = 0; i < n; i++) {
          const u = (i + 0.5 + (c % 2) * 0.5) * BL;
          if (u > w.len - BL / 2) continue;
          const centered = u - w.len / 2;
          const hit = ops.some(
            (o) => o.wall === name && Math.abs(centered - o.c) < o.w / 2 + 0.02 && y + BH / 2 > o.y0 && y - BH / 2 < o.y1,
          );
          if (hit) continue;
          bricks.push({
            x: w.origin[0] + w.dir[0] * u,
            z: w.origin[1] + w.dir[1] * u,
            y,
            rot: w.rotY,
            shade: rnd(bricks.length + 5),
            order: s * 1000 + c * 4 + Object.keys(WALLS).indexOf(name) + rnd(i) * 0.5,
          });
        }
      }
    }
  }
  bricks.sort((a, b) => a.order - b.order);
  const brickMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(BL - 0.015, BH - 0.015, BT), std(0xffffff, { roughness: 0.95 }), bricks.length);
  brickMesh.castShadow = true;
  brickMesh.receiveShadow = true;
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const col = new THREE.Color();
  bricks.forEach((b, i) => {
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), b.rot);
    m4.compose(new THREE.Vector3(b.x, b.y, b.z), q, new THREE.Vector3(1, 1, 1));
    brickMesh.setMatrixAt(i, m4);
    col.setHex(C.brick).offsetHSL(0, (b.shade - 0.5) * 0.04, (b.shade - 0.5) * 0.08);
    brickMesh.setColorAt(i, col);
  });
  brickMesh.count = 0;
  scene.add(brickMesh);
  const progress = { n: 0 };
  tl.to(progress, { n: bricks.length, duration: T(4.4), ease: "none", onUpdate: () => (brickMesh.count = Math.floor(progress.n)) }, T(22.8));

  // ── windows, doors & facade ──
  const glassMat = new THREE.MeshStandardMaterial({ color: 0xcfdcdf, transparent: true, opacity: 0.35, roughness: 0.05, metalness: 0.1 });
  const dark = std(C.charcoal, { roughness: 0.6 });
  const oak = std(C.oak, { roughness: 0.6 });
  const wallPos = (o: Opening): { p: THREE.Vector3; rot: number } => {
    const w = WALLS[o.wall];
    const u = w.len / 2 + o.c;
    return { p: new THREE.Vector3(w.origin[0] + w.dir[0] * u, (o.y0 + o.y1) / 2, w.origin[1] + w.dir[1] * u), rot: w.rotY };
  };
  const frames: THREE.Group[] = [];
  ops.forEach((o) => {
    const { p, rot } = wallPos(o);
    const g = new THREE.Group();
    g.position.copy(p);
    g.rotation.y = rot;
    const h = o.y1 - o.y0;
    const t = 0.07;
    const add = (w: number, hh: number, y: number, x: number, m: THREE.Material, d = 0.16) => g.add(mesh(new THREE.BoxGeometry(w, hh, d), m, [x, y, 0], false));
    add(o.w + 0.1, t, h / 2, 0, dark);
    add(o.w + 0.1, t, -h / 2, 0, dark);
    add(t, h, 0, -o.w / 2, dark);
    add(t, h, 0, o.w / 2, dark);
    if (o.door) {
      g.add(mesh(new THREE.BoxGeometry(o.w - 0.1, h - 0.1, 0.05), oak, [0, 0, 0], false));
      add(0.04, h - 0.2, 0, 0.45, dark, 0.07);
    } else {
      const gl = new THREE.Mesh(new THREE.PlaneGeometry(o.w, h), glassMat);
      g.add(gl);
      add(t * 0.7, h, 0, 0, dark, 0.1);
      add(o.w, t * 0.7, 0, 0, dark, 0.1);
    }
    g.visible = false;
    g.scale.setScalar(0.001);
    scene.add(g);
    frames.push(g);
  });
  frames.forEach((g, i) => {
    const front = ops[i].wall === "front" ? 0 : T(0.9);
    tl.set(g, { visible: true }, T(27.6) + front + (i % 9) * T(0.12));
    tl.to(g.scale, { x: 1, y: 1, z: 1, duration: T(0.5), ease: "back.out(1.6)" }, T(27.6) + front + (i % 9) * T(0.12));
  });
  const canopy = mesh(new THREE.BoxGeometry(2.8, 0.1, 1.4), std(C.brass, { metalness: 0.5, roughness: 0.4 }), [0, GROUND + 2.55, BZ + 0.55]);
  scene.add(canopy);
  canopy.visible = false;
  canopy.scale.setScalar(0.001);
  tl.set(canopy, { visible: true }, T(28.4));
  tl.to(canopy.scale, { x: 1, y: 1, z: 1, duration: T(0.7), ease: "power3.out" }, T(28.4));

  // ── exterior finishing ──
  const lime = std(C.limestone);
  const parapet = new THREE.Group();
  parapet.add(mesh(baseBox(2 * BX + 0.9, 0.55, 0.28), lime, [0, TOP - 0.3, BZ + 0.3]));
  parapet.add(mesh(baseBox(2 * BX + 0.9, 0.55, 0.28), lime, [0, TOP - 0.3, -BZ - 0.3]));
  parapet.add(mesh(baseBox(0.28, 0.55, 2 * BZ + 0.9), lime, [-BX - 0.3, TOP - 0.3, 0]));
  parapet.add(mesh(baseBox(0.28, 0.55, 2 * BZ + 0.9), lime, [BX + 0.3, TOP - 0.3, 0]));
  scene.add(parapet);
  rise(tl, parapet, T(30.0), T(1.0));
  const plinth = mesh(baseBox(2 * BX + 0.45, 0.6, 2 * BZ + 0.45), lime, [0, GROUND - 0.1, 0]);
  scene.add(plinth);
  rise(tl, plinth, T(30.3), T(0.9));
  const fascia = mesh(new THREE.BoxGeometry(2 * BX + 0.55, 0.06, 2 * BZ + 0.55), std(C.brass, { metalness: 0.5, roughness: 0.4 }), [0, TOP - 0.55, 0]);
  fascia.castShadow = false;
  scene.add(fascia);
  fascia.visible = false;
  tl.set(fascia, { visible: true }, T(30.6));
  // vertical limestone fins on the front, either side of the entrance
  const fins = new THREE.Group();
  for (const x of [-2.0, 2.0, -6.4, 6.4]) fins.add(mesh(baseBox(0.18, TOP - 0.9, 0.18), lime, [x, 0.4, BZ + 0.22]));
  scene.add(fins);
  rise(tl, fins, T(30.9), T(1.2));
  scaf.fadeOut(tl, T(31.2), T(1.2));
  tl.to(crane.scale, { y: 0.001, duration: T(1.6), ease: "power2.in" }, T(31.4));
  tl.set(crane, { visible: false }, T(33.0));
  tl.to(ghostEdges.material as THREE.Material, { opacity: 0, duration: T(0.6) }, T(30));
  piles.forEach((p) => tl.to(p.scale, { x: 0.001, y: 0.001, z: 0.001, duration: T(0.8) }, T(32.2)));

  // ── landscaping ──
  tl.set([pitFloor], { visible: false }, T(32.4));
  tl.to(pitWalls.scale, { y: 0.001, duration: T(1.0), ease: "power2.in" }, T(32.2));
  tl.set(footings, { visible: false }, T(33.2));
  coverMat.opacity = 0;
  tl.to(coverMat, { opacity: 1, duration: T(1.0) }, T(32.6));
  const lawnMat = std(C.bg);
  const lawn = new THREE.Mesh(new THREE.PlaneGeometry(2 * SITE_X - 0.6, 2 * SITE_Z - 0.6), lawnMat);
  lawn.rotation.x = -Math.PI / 2;
  lawn.position.y = 0.012;
  lawn.receiveShadow = true;
  scene.add(lawn);
  const green = new THREE.Color(0xbfc9ad);
  tl.to(lawnMat.color, { r: green.r, g: green.g, b: green.b, duration: T(1.6) }, T(33.2));
  const pathMat = std(0xeae3d4);
  const path = mesh(baseBox(1.7, 0.04, 9.6), pathMat, [0, 0.01, BZ + 5.3], false);
  scene.add(path);
  rise(tl, path, T(34.0), T(1.2));
  const drive = mesh(baseBox(5, 0.04, 8), pathMat, [11, 0.01, BZ + 4.5], false);
  scene.add(drive);
  rise(tl, drive, T(34.3), T(1.2));
  const hedgeMat = std(C.sageDark, { roughness: 1 });
  for (const [x, z, w] of [
    [-5.5, BZ + 1.6, 7],
    [5.5, BZ + 1.6, 7],
  ] as V3[]) {
    const h = mesh(baseBox(w, 0.8, 0.7), hedgeMat, [x, 0, z]);
    scene.add(h);
    rise(tl, h, T(34.6), T(1.0));
  }
  const trees = new Trees([
    { x: -18, z: 8, s: 2.6 },
    { x: -17, z: -3, s: 2.2 },
    { x: -9, z: 12, s: 2.0 },
    { x: 19, z: -9, s: 2.4 },
    { x: 17, z: 2, s: 2.1 },
    { x: -2, z: -11, s: 2.2 },
    { x: 8, z: -10, s: 2.0 },
    { x: -8, z: -10.5, s: 2.3 },
    { x: 20, z: 12, s: 2.0 },
    { x: -21, z: 13, s: 2.4 },
    { x: 4, z: 14, s: 1.6 },
    { x: -4.5, z: 14.5, s: 1.5 },
  ]);
  scene.add(trees.group);
  trees.animate(tl, T(34.8), T(2.4));

  // ── camera: aerial → descending → front three-quarter ──
  ctx.camera.position.set(0, 88, 30);
  ctx.target.set(0, 0, 0);
  camTo(tl, ctx, [4, 82, 36], [0, 0, 0], T(0), T(4.2), "sine.inOut");
  camTo(tl, ctx, [46, 46, 54], [0, 2, 0], T(4.2), T(5.8), "sine.inOut");
  camTo(tl, ctx, [42, 31, 54], [0, 3, 0], T(10), T(11), "sine.inOut");
  camTo(tl, ctx, [40, 22, 54], [0, 4.5, 0], T(21), T(10), "sine.inOut");
  camTo(tl, ctx, [32, 11, 46], [0, 4.8, 0], T(31.5), T(7.5), "power2.inOut");

  const stages: Stage[] = [
    { at: 0, label: "Empty site & surveyed boundary" },
    { at: T(4.0), label: "Building footprint & proposal" },
    { at: T(8.0), label: "Excavation & foundation layout" },
    { at: T(11.0), label: "Foundations & structural base" },
    { at: T(14.4), label: "Columns, beams & floor slabs" },
    { at: T(22.2), label: "Brickwork & enclosure" },
    { at: T(27.4), label: "Windows, doors & facade" },
    { at: T(29.8), label: "Exterior finishing" },
    { at: T(32.6), label: "Landscaping & completion" },
  ];
  tl.to({}, { duration: 0.01 }, T(40));
  return { tl, stages };
};
