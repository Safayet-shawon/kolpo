import * as THREE from "three";
import gsap from "gsap";
import { C, Lines, Trees, baseBox, camTo, mesh, outline, rise, rnd, std, type Builder, type Stage, type V3 } from "../common";

/**
 * Residential masterplan assembling itself: empty site → boundary & survey grid → roads → plots → footprints →
 * 3D massing (wireframe → solid) → landscape → finished plan. The "home" variant is faster and ends by pulling one house
 * apart into its layers and reassembling it.
 */

type Block = { x0: number; x1: number; z0: number; z1: number; cols: number; rows: number };

const BOUNDARY: V3[] = [
  [-58, 0.04, -36],
  [56, 0.04, -38],
  [61, 0.04, 2],
  [57, 0.04, 37],
  [-50, 0.04, 38],
  [-61, 0.04, -1],
];

// Plot blocks sit between the avenue (z ±3) and the two cross streets (x ±21..27); the south-centre block is the park.
const BLOCKS: Block[] = [
  { x0: -57, x1: -28, z0: -35, z1: -4.5, cols: 3, rows: 2 },
  { x0: -19.5, x1: 19.5, z0: -35, z1: -4.5, cols: 5, rows: 2 },
  { x0: 28.5, x1: 56, z0: -35, z1: -4.5, cols: 3, rows: 2 },
  { x0: -49, x1: -28, z0: 4.5, z1: 36, cols: 3, rows: 2 },
  { x0: 28.5, x1: 56, z0: 4.5, z1: 36, cols: 3, rows: 2 },
];

const BODY = [0xffffff, 0xffe1d2, 0xd9f1ea, 0xfff0b8, 0xe6e1ff, 0xffd9e4];
const ROOF = [0xe2806a, 0x4fb3aa, 0xf2c14e, 0x8f7cf0, 0xe9a3b4, 0x2f9e75];

const AVENUE_HALF = 3;
const CROSS = [
  [-27, -21],
  [21, 27],
];
const LEVEL_H = 3.1;

interface House {
  group: THREE.Group;
  levels: THREE.Mesh[];
  roof: THREE.Mesh;
  bodyMat: THREE.MeshStandardMaterial;
  roofMat: THREE.MeshStandardMaterial;
  plot: { x0: number; z0: number; x1: number; z1: number };
  fp: { x0: number; z0: number; x1: number; z1: number };
  cx: number;
  cz: number;
  nLevels: number;
}

function planHouses(): { plots: House["plot"][]; list: House[] } {
  const plots: House["plot"][] = [];
  const list: House[] = [];
  let i = 0;
  for (const b of BLOCKS) {
    const pw = (b.x1 - b.x0) / b.cols;
    const pd = (b.z1 - b.z0) / b.rows;
    for (let r = 0; r < b.rows; r++)
      for (let c = 0; c < b.cols; c++) {
        const plot = { x0: b.x0 + c * pw, x1: b.x0 + (c + 1) * pw, z0: b.z0 + r * pd, z1: b.z0 + (r + 1) * pd };
        plots.push(plot);
        const cx = (plot.x0 + plot.x1) / 2;
        const cz = (plot.z0 + plot.z1) / 2;
        const w = pw * (0.56 + rnd(i) * 0.1);
        const d = pd * (0.46 + rnd(i + 9) * 0.08);
        const nLevels = rnd(i + 21) > 0.55 ? 3 : 2;

        const group = new THREE.Group();
        group.position.set(cx, 0, cz);
        const bodyMat = std(BODY[i % BODY.length]);
        const roofMat = std(ROOF[(i * 3 + 1) % ROOF.length]);
        const levels: THREE.Mesh[] = [];
        let lw = w;
        let ld = d;
        let ox = 0;
        let oz = 0;
        for (let l = 0; l < nLevels; l++) {
          if (l > 0) {
            lw = w * (l === nLevels - 1 ? 0.72 : 0.9);
            ld = d * (l === nLevels - 1 ? 0.82 : 0.94);
            ox = (rnd(i * 3 + l) - 0.5) * (w - lw);
            oz = (rnd(i * 5 + l) - 0.5) * (d - ld) * 0.6;
          }
          const m = mesh(baseBox(lw, LEVEL_H, ld), bodyMat, [ox, l * LEVEL_H, oz], false);
          outline(m, C.charcoal, 0.5);
          group.add(m);
          levels.push(m);
        }
        const top = levels[levels.length - 1];
        const roof = mesh(
          baseBox(lw + 0.5, 0.28, ld + 0.5),
          roofMat,
          [top.position.x, nLevels * LEVEL_H, top.position.z],
          false,
        );
        outline(roof, C.charcoal, 0.4);
        group.add(roof);
        list.push({
          group,
          levels,
          roof,
          bodyMat,
          roofMat,
          plot,
          fp: { x0: cx - w / 2, x1: cx + w / 2, z0: cz - d / 2, z1: cz + d / 2 },
          cx,
          cz,
          nLevels,
        });
        i++;
      }
  }
  return { plots, list };
}

function treeList() {
  const t: { x: number; z: number; s: number }[] = [];
  let k = 0;
  // street trees along the avenue and cross streets
  for (let x = -57; x <= 57; x += 6.5) {
    const inCross = CROSS.some(([a, b]) => x > a - 2 && x < b + 2);
    if (inCross) continue;
    t.push({ x, z: -AVENUE_HALF - 1.2, s: 1.5 + rnd(k++) * 0.5 });
    t.push({ x, z: AVENUE_HALF + 1.2, s: 1.5 + rnd(k++) * 0.5 });
  }
  for (const cx of [-24, 24])
    for (let z = -33; z <= 35; z += 6.5) {
      if (Math.abs(z) < 7) continue;
      t.push({ x: cx - 3.6, z, s: 1.4 + rnd(k++) * 0.5 });
      t.push({ x: cx + 3.6, z, s: 1.4 + rnd(k++) * 0.5 });
    }
  // park
  for (let n = 0; n < 26; n++) {
    const x = -17 + rnd(n + 100) * 34;
    const z = 7 + rnd(n + 200) * 26;
    const nearPond = ((x + 5) / 9) ** 2 + ((z - 22) / 5.5) ** 2 < 1.2;
    const nearPavilion = Math.abs(x - 7) < 7 && Math.abs(z - 13) < 5;
    if (nearPond || nearPavilion) continue;
    t.push({ x, z, s: 1.8 + rnd(n + 300) * 1.1 });
  }
  return t;
}

export function buildMasterplan(): Builder {
  return (ctx) => {
    const k = 0.55;
    const T = (t: number) => t * k;
    const tl = gsap.timeline({ paused: true });
    const { scene } = ctx;

    // ── ground ──
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), std(C.bg));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const { plots, list: houses } = planHouses();

    // ── survey grid ──
    const grid = new Lines();
    for (let x = -66; x <= 66; x += 6) grid.seg([x, 0.01, -46], [x, 0.01, 46]);
    for (let z = -46; z <= 46; z += 6) grid.seg([-66, 0.01, z], [66, 0.01, z]);
    scene.add(grid.build(C.charcoal, 0.12));
    grid.draw(tl, T(0.5), T(2.2), "power1.out");

    // ── site boundary, stakes, dimension ticks ──
    const boundary = new Lines().poly(BOUNDARY, true);
    scene.add(boundary.build(C.charcoal, 0.95));
    boundary.draw(tl, T(2.6), T(2.4));
    const stakeMat = std(C.brass);
    BOUNDARY.forEach((p, i) => {
      const s = mesh(baseBox(0.7, 1.6, 0.7), stakeMat, [p[0], 0, p[2]], false);
      scene.add(s);
      rise(tl, s, T(2.8 + i * 0.3), T(0.6));
    });
    const dims = new Lines()
      .seg([-58, 0.04, -41], [56, 0.04, -43])
      .seg([-58, 0.04, -39.5], [-58, 0.04, -42.5])
      .seg([56, 0.04, -41.5], [56, 0.04, -44.5])
      .seg([-67, 0.04, -1], [-67, 0.04, 38])
      .seg([-68.5, 0.04, -1], [-65.5, 0.04, -1])
      .seg([-68.5, 0.04, 38], [-65.5, 0.04, 38]);
    scene.add(dims.build(C.charcoal, 0.7));
    dims.draw(tl, T(4.0), T(1.2));

    // ── roads: edge lines (no crossing noise), then fills ──
    const road = new Lines();
    const avenueRanges: [number, number][] = [
      [-60, -27],
      [-21, 21],
      [27, 60],
    ];
    for (const z of [-AVENUE_HALF, AVENUE_HALF]) for (const [a, b] of avenueRanges) road.seg([a, 0.05, z], [b, 0.05, z]);
    for (const [a, b] of CROSS) {
      for (const x of [a, b]) {
        road.seg([x, 0.05, -38], [x, 0.05, -AVENUE_HALF]);
        road.seg([x, 0.05, AVENUE_HALF], [x, 0.05, 38]);
      }
    }
    scene.add(road.build(C.charcoal, 0.8));
    road.draw(tl, T(5.0), T(2.2));
    const roadMat = std(C.bg);
    const roadTarget = new THREE.Color(0xf3dec8);
    const roadShapes: [number, number, number, number][] = [
      [-60, -AVENUE_HALF, 60, AVENUE_HALF],
      [-27, -38, -21, 38],
      [21, -38, 27, 38],
    ];
    roadShapes.forEach(([x0, z0, x1, z1], i) => {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), roadMat);
      p.rotation.x = -Math.PI / 2;
      p.position.set((x0 + x1) / 2, 0.012 + i * 0.001, (z0 + z1) / 2);
      p.receiveShadow = true;
      scene.add(p);
    });
    tl.to(roadMat.color, { r: roadTarget.r, g: roadTarget.g, b: roadTarget.b, duration: T(1.2) }, T(6.2));
    const dash = new Lines();
    for (let x = -58; x < 58; x += 4) if (!CROSS.some(([a, b]) => x > a - 2 && x < b)) dash.seg([x, 0.06, 0], [x + 2, 0.06, 0]);
    scene.add(dash.build(C.charcoal, 0.35));
    dash.draw(tl, T(6.8), T(0.9), "none");

    // ── plot layout ──
    const plotLines = new Lines();
    plots.forEach((p) => plotLines.rect(p.x0 + 0.4, p.z0 + 0.4, p.x1 - 0.4, p.z1 - 0.4, 0.05));
    scene.add(plotLines.build(C.charcoal, 0.55));
    plotLines.draw(tl, T(7.7), T(1.8));

    // ── building footprints ──
    const fpLines = new Lines();
    houses.forEach((h) => fpLines.rect(h.fp.x0, h.fp.z0, h.fp.x1, h.fp.z1, 0.07));
    scene.add(fpLines.build(C.charcoal, 0.95));
    fpLines.draw(tl, T(9.5), T(1.5));
    const fpMat = std(C.bg);
    const fpTarget = new THREE.Color(0xffd5bd);
    houses.forEach((h) => {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(h.fp.x1 - h.fp.x0, h.fp.z1 - h.fp.z0), fpMat);
      p.rotation.x = -Math.PI / 2;
      p.position.set(h.cx, 0.03, h.cz);
      p.receiveShadow = true;
      scene.add(p);
    });
    tl.to(fpMat.color, { r: fpTarget.r, g: fpTarget.g, b: fpTarget.b, duration: T(1.0) }, T(10.4));

    // ── massing: wireframe rises first, then the solid fades in ──
    const order = [...houses].sort((a, b) => Math.hypot(a.cx, a.cz) - Math.hypot(b.cx, b.cz));
    order.forEach((h, i) => {
      const at = T(11.5) + i * T(0.1);
      scene.add(h.group);
      h.bodyMat.transparent = h.roofMat.transparent = true;
      h.bodyMat.opacity = h.roofMat.opacity = 0;
      h.group.visible = false;
      h.group.scale.y = 0.001;
      tl.set(h.group, { visible: true }, at);
      tl.to(h.group.scale, { y: 1, duration: T(1.0), ease: "power3.out" }, at);
      tl.to([h.bodyMat, h.roofMat], { opacity: 1, duration: T(0.7), ease: "power1.inOut" }, at + T(0.55));
      tl.call(
        () => {
          h.bodyMat.transparent = h.roofMat.transparent = false;
          h.levels.forEach((m) => (m.castShadow = true));
          h.roof.castShadow = true;
        },
        [],
        at + T(1.3),
      );
    });

    // ── landscape & community ──
    const lawnMat = std(C.bg);
    const lawn = new THREE.Mesh(new THREE.PlaneGeometry(38, 29), lawnMat);
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.set(0, 0.02, 19.5);
    lawn.receiveShadow = true;
    scene.add(lawn);
    const lawnTarget = new THREE.Color(0xcdeccf);
    tl.to(lawnMat.color, { r: lawnTarget.r, g: lawnTarget.g, b: lawnTarget.b, duration: T(1.6) }, T(16.3));
    const pondMat = std(C.water, { roughness: 0.35 });
    const pond = new THREE.Mesh(new THREE.CircleGeometry(1, 40), pondMat);
    pond.rotation.x = -Math.PI / 2;
    pond.scale.set(9, 5.5, 1);
    pond.position.set(-5, 0.035, 22);
    scene.add(pond);
    pond.visible = false;
    tl.set(pond, { visible: true }, T(17.0));
    pond.scale.set(0.001, 0.001, 1);
    tl.to(pond.scale, { x: 9, y: 5.5, duration: T(1.4), ease: "power2.out" }, T(17.0));
    const pavilion = new THREE.Group();
    const pv = mesh(baseBox(9, 3.2, 5), std(0xffffff), [0, 0, 0]);
    outline(pv);
    const pr = mesh(baseBox(10, 0.3, 6), std(C.limestone), [0, 3.2, 0]);
    pavilion.add(pv, pr);
    pavilion.position.set(7, 0, 13);
    scene.add(pavilion);
    rise(tl, pavilion, T(17.4), T(1.0));
    const walk = new Lines()
      .poly([[-18, 0.06, 6], [-10, 0.06, 12], [0, 0.06, 15], [7, 0.06, 17], [18, 0.06, 24]])
      .poly([[0, 0.06, 4], [0, 0.06, 15]]);
    scene.add(walk.build(C.charcoal, 0.4));
    walk.draw(tl, T(17.2), T(1.4));

    const trees = new Trees(treeList());
    scene.add(trees.group);
    trees.animate(tl, T(17.6), T(2.4));

    // survey scaffolding fades as the plan matures
    grid.fadeOut(tl, T(16.2), T(1.2));
    dims.fadeOut(tl, T(18.5), T(1.0));

    // ── camera ──
    ctx.camera.position.set(0, 175, 12);
    ctx.target.set(0, 0, 0);
    camTo(tl, ctx, [4, 172, 24], [0, 0, 0], T(0), T(2.4), "sine.inOut");
    camTo(tl, ctx, [-14, 150, 66], [0, 0, 0], T(2.6), T(6.6), "sine.inOut");
    camTo(tl, ctx, [62, 136, 130], [0, 0, 2], T(9.6), T(5.4), "sine.inOut");

    camTo(tl, ctx, [122, 108, 164], [0, 0, 6], T(19.4), T(5.0), "sine.inOut");
    const end = T(25);
    const stages: Stage[] = [
      { at: 0, label: "Empty site" },
      { at: T(2.4), label: "Site boundary & survey grid" },
      { at: T(5.0), label: "Roads & circulation" },
      { at: T(7.6), label: "Residential plot layout" },
      { at: T(9.4), label: "Building footprints" },
      { at: T(11.4), label: "Three-dimensional massing" },
      { at: T(16.2), label: "Landscape & community" },
      { at: T(19.6), label: "The finished masterplan" },
    ];

    // pad the timeline so the final composition holds
    tl.to({}, { duration: 0.01 }, end);
    return { tl, stages };
  };
}

