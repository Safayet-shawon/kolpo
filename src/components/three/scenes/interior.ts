import * as THREE from "three";
import gsap from "gsap";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { C, Lines, baseBox, camTo, canvasTexture, mesh, outline, rise, rnd, std, type Builder, type Stage } from "../common";

/**
 * One fixed room, built up in clear stages: exploded shell closes → floor & wall finishes → ceiling & lighting →
 * built-in joinery → furniture assembles (grows from the floor, never passes through walls) → lights on → details.
 */

const W = 7;
const D = 5.6;
const H = 2.9;
const HW = W / 2;
const HD = D / 2;
const WALL = 0.16;

const rbox = (w: number, h: number, d: number, r = 0.05) => new RoundedBoxGeometry(w, h, d, 3, r);

export const buildInterior: Builder = (ctx) => {
  const k = 0.5;
  const T = (t: number) => t * k;
  const tl = gsap.timeline({ paused: true });
  const { scene } = ctx;

  // lighting for a daylit room: low sun through the right-hand window
  ctx.sun.position.set(14, 7, 5);
  ctx.sun.target.position.set(0, 0, 0);
  ctx.sun.intensity = 2.6;
  const sc = ctx.sun.shadow.camera;
  sc.left = -9;
  sc.right = 9;
  sc.top = 9;
  sc.bottom = -9;
  sc.near = 1;
  sc.far = 40;
  sc.updateProjectionMatrix();
  ctx.hemi.intensity = 1.45;
  scene.add(ctx.sun.target);

  // ── surroundings & floor ──
  const outside = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), std(C.bg));
  outside.rotation.x = -Math.PI / 2;
  outside.position.y = -0.02;
  outside.receiveShadow = true;
  scene.add(outside);

  const floorBase = new THREE.Mesh(new THREE.PlaneGeometry(W, D), std(0xcfcabf));
  floorBase.rotation.x = -Math.PI / 2;
  floorBase.receiveShadow = true;
  scene.add(floorBase);

  const plank = canvasTexture(
    1024,
    1024,
    (g) => {
      g.fillStyle = "#c8a679";
      g.fillRect(0, 0, 1024, 1024);
      const rows = 12;
      for (let r = 0; r < rows; r++) {
        let x = -rnd(r + 40) * 300;
        while (x < 1024) {
          const len = 280 + rnd(r * 17 + x) * 300;
          const tone = 168 + Math.floor(rnd(r * 31 + x * 0.1) * 34);
          g.fillStyle = `rgb(${tone + 30},${tone - 2},${tone - 50})`;
          g.fillRect(x, (r * 1024) / rows, len, 1024 / rows - 2);
          // grain
          g.strokeStyle = "rgba(90,60,30,0.10)";
          for (let n = 0; n < 5; n++) {
            const y = (r * 1024) / rows + 5 + rnd(r * 7 + n + x) * (1024 / rows - 12);
            g.beginPath();
            g.moveTo(x + 4, y);
            g.lineTo(x + len - 4, y);
            g.stroke();
          }
          g.fillStyle = "rgba(60,40,20,0.35)";
          g.fillRect(x + len - 2, (r * 1024) / rows, 2, 1024 / rows);
          x += len;
        }
      }
    },
    [1.4, 1.1],
  );
  // The finished floor wipes in left→right (pivot on the left edge).
  const woodGeo = new THREE.PlaneGeometry(W, D);
  woodGeo.translate(W / 2, 0, 0);
  const wood = new THREE.Mesh(woodGeo, std(0xffffff, { map: plank, roughness: 0.55 }));
  wood.rotation.x = -Math.PI / 2;
  wood.position.set(-HW, 0.006, 0);
  wood.receiveShadow = true;
  wood.scale.x = 0.001;
  scene.add(wood);
  tl.to(wood.scale, { x: 1, duration: T(2.2), ease: "power2.inOut" }, T(4.0));

  // ── shell: four parts that start exploded and close in ──
  const wallMat = std(0xfffaf2);
  const wallShadow = (m: THREE.Mesh) => {
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };
  const backG = new THREE.Group();
  const back = wallShadow(mesh(new THREE.BoxGeometry(W + WALL * 2, H, WALL), wallMat, [0, H / 2, -HD - WALL / 2]));
  outline(back, C.charcoal, 0.35);
  backG.add(back);

  const leftG = new THREE.Group();
  const left = wallShadow(mesh(new THREE.BoxGeometry(WALL, H, D), wallMat, [-HW - WALL / 2, H / 2, 0]));
  outline(left, C.charcoal, 0.35);
  leftG.add(left);

  const rightG = new THREE.Group();
  const gz0 = -1.5;
  const gz1 = 1.5;
  const gy0 = 0.55;
  const gy1 = 2.35;
  const px = HW + WALL / 2;
  const pieces: [number, number, number, number, number, number][] = [
    [WALL, gy0, D, px, gy0 / 2, 0],
    [WALL, H - gy1, D, px, gy1 + (H - gy1) / 2, 0],
    [WALL, gy1 - gy0, gz0 + HD, px, gy0 + (gy1 - gy0) / 2, (-HD + gz0) / 2],
    [WALL, gy1 - gy0, HD - gz1, px, gy0 + (gy1 - gy0) / 2, (HD + gz1) / 2],
  ];
  for (const [w, h, d, x, y, z] of pieces) {
    const m = wallShadow(mesh(new THREE.BoxGeometry(w, h, d), wallMat, [x, y, z]));
    outline(m, C.charcoal, 0.35);
    rightG.add(m);
  }
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(gz1 - gz0, gy1 - gy0),
    new THREE.MeshStandardMaterial({ color: 0xdde8ea, transparent: true, opacity: 0.16, roughness: 0.05 }),
  );
  glass.rotation.y = -Math.PI / 2;
  glass.position.set(HW + WALL / 2, (gy0 + gy1) / 2, 0);
  rightG.add(glass);
  const frameMat = std(C.charcoal);
  const fr = (w: number, h: number, d: number, y: number, z: number) =>
    rightG.add(mesh(new THREE.BoxGeometry(w, h, d), frameMat, [HW + WALL / 2, y, z], false));
  fr(0.07, 0.05, gz1 - gz0, gy0, 0);
  fr(0.07, 0.05, gz1 - gz0, gy1, 0);
  fr(0.07, gy1 - gy0, 0.05, (gy0 + gy1) / 2, gz0);
  fr(0.07, gy1 - gy0, 0.05, (gy0 + gy1) / 2, gz1);
  fr(0.05, gy1 - gy0, 0.04, (gy0 + gy1) / 2, 0);
  const garden = canvasTexture(1024, 512, (g) => {
    const sky = g.createLinearGradient(0, 0, 0, 512);
    sky.addColorStop(0, "#dbe7ea");
    sky.addColorStop(0.55, "#f5f1e6");
    sky.addColorStop(1, "#cfd8bf");
    g.fillStyle = sky;
    g.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 70; i++) {
      const x = rnd(i) * 1024;
      const y = 250 + rnd(i + 90) * 230;
      const r = 40 + rnd(i + 17) * 90;
      g.fillStyle = `rgba(${95 + rnd(i) * 40},${130 + rnd(i + 5) * 45},${85 + rnd(i + 8) * 30},${0.45 + rnd(i + 3) * 0.4})`;
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fill();
    }
  });
  const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(26, 13), new THREE.MeshBasicMaterial({ map: garden, toneMapped: false }));
  backdrop.rotation.y = -Math.PI / 2;
  backdrop.position.set(HW + 6, 4, 0);
  rightG.add(backdrop);

  const ceilG = new THREE.Group();
  const ceil = wallShadow(mesh(new THREE.BoxGeometry(W + WALL * 2, WALL, D + WALL), wallMat, [0, H + WALL / 2, -WALL / 2]));
  outline(ceil, C.charcoal, 0.3);
  ceilG.add(ceil);

  scene.add(backG, leftG, rightG, ceilG);
  // exploded start
  backG.position.z = -2.2;
  leftG.position.x = -2.6;
  rightG.position.x = 2.6;
  ceilG.position.y = 4.8;
  tl.to(backG.position, { z: 0, duration: T(2.0), ease: "power3.inOut" }, T(0.8));
  tl.to(leftG.position, { x: 0, duration: T(2.0), ease: "power3.inOut" }, T(1.0));
  tl.to(rightG.position, { x: 0, duration: T(2.0), ease: "power3.inOut" }, T(1.2));
  // ceiling lowers later, in the ceiling stage
  tl.to(ceilG.position, { y: 0, duration: T(2.0), ease: "power3.inOut" }, T(8.4));

  // wall finish: ivory → warm limewash
  const limewash = new THREE.Color(0xffe6d0);
  tl.to(wallMat.color, { r: limewash.r, g: limewash.g, b: limewash.b, duration: T(2.0) }, T(5.2));

  // slat feature wall behind the sofa
  const slatMat = std(0xb99a70);
  const slatBack = mesh(new THREE.BoxGeometry(3.1, 2.5, 0.04), std(0x1f7f78), [0, 1.25, -HD + 0.03], false);
  slatBack.visible = false;
  scene.add(slatBack);
  tl.set(slatBack, { visible: true }, T(6.0));
  const slatGeo = baseBox(0.045, 2.5, 0.07);
  for (let i = 0; i < 31; i++) {
    const s = mesh(slatGeo, slatMat, [-1.4 + i * 0.0933, 0, -HD + 0.09], false);
    scene.add(s);
    rise(tl, s, T(6.1) + i * T(0.04), T(0.7), "power2.out");
  }

  // ── ceiling & lighting ──
  const warm = new THREE.Color(0xffd9a0);
  const coveMat = new THREE.MeshStandardMaterial({ color: 0xfff5e4, emissive: warm, emissiveIntensity: 0, roughness: 0.6 });
  const cove = new THREE.Group();
  const coveBack = mesh(new THREE.BoxGeometry(W, 0.05, 0.12), coveMat, [0, H - 0.18, -HD + 0.1], false);
  const coveLeft = mesh(new THREE.BoxGeometry(0.12, 0.05, D), coveMat, [-HW + 0.1, H - 0.18, 0], false);
  const coveRight = mesh(new THREE.BoxGeometry(0.12, 0.05, D), coveMat, [HW - 0.1, H - 0.18, 0], false);
  const dropBack = mesh(new THREE.BoxGeometry(W, 0.18, 0.1), wallMat, [0, H - 0.09, -HD + 0.16], false);
  cove.add(coveBack, coveLeft, coveRight, dropBack);
  cove.visible = false;
  scene.add(cove);
  tl.set(cove, { visible: true }, T(9.4));
  cove.scale.set(0.001, 1, 1);
  tl.to(cove.scale, { x: 1, duration: T(1.4), ease: "power2.out" }, T(9.4));

  const downMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: warm, emissiveIntensity: 0 });
  const downGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.03, 20);
  const downlights: THREE.Mesh[] = [];
  for (const x of [-1.8, 0, 1.8])
    for (const z of [-1.2, 0.9]) {
      const d = mesh(downGeo, downMat, [x, H - 0.02, z], false);
      downlights.push(d);
      scene.add(d);
      d.visible = false;
      tl.set(d, { visible: true }, T(9.8) + downlights.length * T(0.08));
    }

  const brass = std(C.brass, { metalness: 0.65, roughness: 0.35 });
  const pendMat = new THREE.MeshStandardMaterial({ color: 0xfff3dc, emissive: warm, emissiveIntensity: 0, side: THREE.DoubleSide });
  const pendants: THREE.Group[] = [];
  for (const x of [-0.6, 0.6]) {
    const g = new THREE.Group();
    g.position.set(x, H, -0.55);
    const cord = mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.25, 6), frameMat, [0, -0.625, 0], false);
    const dome = mesh(new THREE.SphereGeometry(0.26, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), brass, [0, -1.25, 0], false);
    dome.scale.y = 0.8;
    const glow = mesh(new THREE.CircleGeometry(0.24, 28), pendMat, [0, -1.252, 0], false);
    glow.rotation.x = Math.PI / 2;
    g.add(cord, dome, glow);
    scene.add(g);
    g.visible = false;
    g.scale.y = 0.001;
    tl.set(g, { visible: true }, T(10.4));
    tl.to(g.scale, { y: 1, duration: T(1.3), ease: "power3.out" }, T(10.4) + pendants.length * T(0.2));
    pendants.push(g);
  }

  // ── built-in bookcase on the left wall ──
  const caseG = new THREE.Group();
  caseG.position.set(-HW, 0, -1.0);
  const oak = std(C.oak, { roughness: 0.6 });
  const depth = 0.4;
  const cw = 2.6;
  const chh = 2.45;
  const add = (g: THREE.BufferGeometry, x: number, y: number, z: number) => caseG.add(mesh(g, oak, [x, y, z]));
  add(new THREE.BoxGeometry(depth, chh, 0.04), depth / 2, chh / 2, -cw / 2);
  add(new THREE.BoxGeometry(depth, chh, 0.04), depth / 2, chh / 2, cw / 2);
  add(new THREE.BoxGeometry(0.03, chh, cw), 0.015, chh / 2, 0);
  for (let s = 0; s <= 5; s++) add(new THREE.BoxGeometry(depth, 0.035, cw), depth / 2, 0.08 + s * 0.46, 0);
  add(new THREE.BoxGeometry(depth + 0.02, 0.18, cw + 0.06), depth / 2, 0.04, 0); // plinth
  outline(caseG.children[0] as THREE.Mesh, C.charcoal, 0.25);
  caseG.visible = false;
  caseG.scale.x = 0.001;
  scene.add(caseG);
  tl.set(caseG, { visible: true }, T(11.7));
  tl.to(caseG.scale, { x: 1, duration: T(1.6), ease: "power3.out" }, T(11.7));
  // books & objects
  const bookCols = [0xe8e0d0, 0x93a287, 0x2a2927, 0xb08d57, 0xc9b79a, 0x7d8b73, 0xd8cdb8];
  const books = new THREE.Group();
  for (let s = 0; s < 5; s++) {
    let z = -cw / 2 + 0.1;
    while (z < cw / 2 - 0.2) {
      if (rnd(s * 40 + z * 10) > 0.82) {
        z += 0.25; // gap or object
        continue;
      }
      const bh = 0.24 + rnd(s * 13 + z * 7) * 0.12;
      const bw = 0.03 + rnd(s * 3 + z) * 0.03;
      const b = mesh(baseBox(0.24, bh, bw), std(bookCols[Math.floor(rnd(s * 9 + z * 31) * bookCols.length)]), [0.22, 0.1 + s * 0.46, z], false);
      books.add(b);
      z += bw + 0.004;
    }
  }
  books.position.set(-HW, 0, -1.0);
  books.visible = false;
  scene.add(books);
  books.scale.y = 0.001;
  tl.set(books, { visible: true }, T(13.2));
  tl.to(books.scale, { y: 1, duration: T(1.0), ease: "power2.out" }, T(13.2));

  // ── furniture ──
  const linen = std(0x2fa89d, { roughness: 1 });
  const boucle = std(0xf29a80, { roughness: 1 });
  const travertine = std(0xe0d3b9, { roughness: 0.8 });
  const darkWood = std(0x6b5640, { roughness: 0.6 });
  const groups: THREE.Group[] = [];
  const furniture = (g: THREE.Group, pos: [number, number, number], rotY = 0) => {
    g.position.set(...pos);
    g.rotation.y = rotY;
    g.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        (o as THREE.Mesh).castShadow = true;
        (o as THREE.Mesh).receiveShadow = true;
      }
    });
    scene.add(g);
    groups.push(g);
    return g;
  };
  const part = (g: THREE.Group, geo: THREE.BufferGeometry, m: THREE.Material, pos: [number, number, number], rot?: [number, number, number]) => {
    const x = new THREE.Mesh(geo, m);
    x.position.set(...pos);
    if (rot) x.rotation.set(...rot);
    g.add(x);
    return x;
  };

  // rug
  const rug = new THREE.Group();
  part(rug, new THREE.BoxGeometry(3.3, 0.02, 2.3), std(0xf6d58a, { roughness: 1 }), [0, 0.01, 0]);
  const rugLines = new Lines().rect(-1.5, -1.0, 1.5, 1.0, 0.025);
  const rugEdge = rugLines.build(0xb7a98c, 0.9);
  rug.add(rugEdge);
  rugEdge.geometry.setDrawRange(0, Infinity); // the stitched border simply grows with the rug
  furniture(rug, [0, 0, -0.7]);

  // sofa
  const sofa = new THREE.Group();
  part(sofa, rbox(2.4, 0.4, 0.95), linen, [0, 0.32, 0]);
  part(sofa, rbox(2.4, 0.55, 0.22), linen, [0, 0.72, -0.37]);
  part(sofa, rbox(0.22, 0.5, 0.95), linen, [-1.09, 0.5, 0]);
  part(sofa, rbox(0.22, 0.5, 0.95), linen, [1.09, 0.5, 0]);
  part(sofa, rbox(0.98, 0.16, 0.72, 0.07), linen, [-0.5, 0.58, 0.07]);
  part(sofa, rbox(0.98, 0.16, 0.72, 0.07), linen, [0.5, 0.58, 0.07]);
  part(sofa, rbox(0.92, 0.42, 0.16, 0.07), linen, [-0.5, 0.82, -0.2], [-0.2, 0, 0]);
  part(sofa, rbox(0.92, 0.42, 0.16, 0.07), linen, [0.5, 0.82, -0.2], [-0.2, 0, 0]);
  for (const x of [-1.0, 1.0]) part(sofa, new THREE.CylinderGeometry(0.025, 0.02, 0.12, 8), darkWood, [x, 0.06, 0.38]);
  for (const x of [-1.0, 1.0]) part(sofa, new THREE.CylinderGeometry(0.025, 0.02, 0.12, 8), darkWood, [x, 0.06, -0.38]);
  part(sofa, rbox(0.42, 0.36, 0.12, 0.05), std(C.sage, { roughness: 1 }), [-0.85, 0.84, -0.02], [-0.25, 0.3, 0]);
  furniture(sofa, [0, 0, -2.15]);

  // coffee table
  const table = new THREE.Group();
  part(table, new THREE.CylinderGeometry(0.55, 0.55, 0.06, 48), travertine, [0, 0.38, 0]);
  part(table, new THREE.CylinderGeometry(0.28, 0.32, 0.35, 32), std(0xc9bda4), [0, 0.18, 0]);
  furniture(table, [0, 0, -0.6]);

  // armchairs
  const chair = (side: 1 | -1) => {
    const g = new THREE.Group();
    part(g, rbox(0.82, 0.38, 0.8, 0.07), boucle, [0, 0.32, 0]);
    part(g, rbox(0.82, 0.56, 0.18, 0.08), boucle, [0, 0.6, -0.33], [-0.12, 0, 0]);
    part(g, rbox(0.16, 0.34, 0.8, 0.06), boucle, [-0.33, 0.52, 0]);
    part(g, rbox(0.16, 0.34, 0.8, 0.06), boucle, [0.33, 0.52, 0]);
    for (const x of [-0.3, 0.3]) for (const z of [-0.3, 0.3]) part(g, new THREE.CylinderGeometry(0.025, 0.02, 0.14, 8), darkWood, [x, 0.07, z]);
    return furniture(g, [side * 1.95, 0, -0.55], (side * Math.PI) / 2 - side * 0.3);
  };
  const chairL = chair(-1);
  chair(1);
  void chairL;

  // side table + vase
  const side = new THREE.Group();
  part(side, new THREE.CylinderGeometry(0.24, 0.24, 0.03, 32), brass, [0, 0.5, 0]);
  part(side, new THREE.CylinderGeometry(0.03, 0.03, 0.5, 12), brass, [0, 0.25, 0]);
  part(side, new THREE.CylinderGeometry(0.2, 0.2, 0.02, 24), brass, [0, 0.01, 0]);
  furniture(side, [1.75, 0, -2.2]);

  // floor lamp
  const lamp = new THREE.Group();
  part(lamp, new THREE.CylinderGeometry(0.16, 0.18, 0.03, 24), brass, [0, 0.015, 0]);
  part(lamp, new THREE.CylinderGeometry(0.014, 0.014, 1.55, 8), brass, [0, 0.8, 0]);
  const lampShadeMat = new THREE.MeshStandardMaterial({ color: 0xf3ead8, emissive: warm, emissiveIntensity: 0, side: THREE.DoubleSide });
  part(lamp, new THREE.CylinderGeometry(0.2, 0.26, 0.34, 28, 1, true), lampShadeMat, [0, 1.65, 0]);
  furniture(lamp, [2.75, 0, -2.25]);

  // plant
  const plant = new THREE.Group();
  part(plant, new THREE.CylinderGeometry(0.26, 0.2, 0.42, 24), std(C.limestone), [0, 0.21, 0]);
  const leaf = std(C.sageDark, { flatShading: true });
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    const r = 0.18 + rnd(i) * 0.12;
    const s = part(plant, new THREE.IcosahedronGeometry(0.2 + rnd(i + 4) * 0.12, 0), leaf, [Math.cos(a) * r, 0.62 + rnd(i + 9) * 0.55, Math.sin(a) * r]);
    s.scale.y = 1.4;
  }
  furniture(plant, [3.0, 0, 1.95]);

  // objects on the table
  const deco = new THREE.Group();
  part(deco, baseBox(0.34, 0.04, 0.24), std(0xe8e0d0), [0, 0.41, 0], [0, 0.3, 0]);
  part(deco, baseBox(0.3, 0.035, 0.2), std(C.sageDark), [0, 0.45, 0], [0, 0.1, 0]);
  part(deco, new THREE.CylinderGeometry(0.06, 0.08, 0.22, 20), std(0xf3efe6), [0.2, 0.52, 0.12]);
  furniture(deco, [0, 0, -0.6]);

  // assemble: furniture grows from the floor in a considered order
  const order = [rug, sofa, table, groups[3], groups[4], side, lamp, plant, deco];
  order.forEach((g, i) => {
    g.visible = false;
    g.scale.y = 0.001;
    const at = T(14.5) + i * T(0.55);
    tl.set(g, { visible: true }, at);
    tl.to(g.scale, { y: 1, duration: T(0.9), ease: "expo.out" }, at);
  });

  // art on the back wall (right of the slats)
  const art = new THREE.Group();
  const artTex = canvasTexture(512, 360, (g) => {
    g.fillStyle = "#efe8d9";
    g.fillRect(0, 0, 512, 360);
    g.fillStyle = "#b08d57";
    g.beginPath();
    g.arc(170, 190, 110, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#73846a";
    g.fillRect(260, 90, 160, 210);
    g.fillStyle = "#2a2927";
    g.fillRect(100, 290, 330, 8);
  });
  part(art, new THREE.BoxGeometry(1.3, 0.92, 0.04), frameMat, [0, 0, 0]);
  part(art, new THREE.PlaneGeometry(1.2, 0.82), new THREE.MeshBasicMaterial({ map: artTex }), [0, 0, 0.022]);
  art.position.set(2.35, 1.55, -HD + 0.03);
  art.visible = false;
  art.scale.setScalar(0.001);
  scene.add(art);
  tl.set(art, { visible: true }, T(22.2));
  tl.to(art.scale, { x: 1, y: 1, z: 1, duration: T(0.8), ease: "back.out(1.4)" }, T(22.2));

  // curtains hang from the ceiling line
  const curtainMat = std(0xebe3d1, { roughness: 1 });
  for (const z of [-1.95, 1.95]) {
    const cg = new THREE.Group();
    const geo = new THREE.BoxGeometry(0.06, 2.75, 0.5);
    geo.translate(0, -1.375, 0);
    cg.add(mesh(geo, curtainMat, [0, 0, 0]));
    for (let f = 0; f < 5; f++) {
      const g2 = new THREE.BoxGeometry(0.1, 2.7, 0.05);
      g2.translate(0, -1.35, 0);
      cg.add(mesh(g2, curtainMat, [-0.03, 0, -0.2 + f * 0.1]));
    }
    cg.position.set(HW - 0.1, 2.82, z);
    cg.visible = false;
    cg.scale.y = 0.001;
    scene.add(cg);
    tl.set(cg, { visible: true }, T(21.7));
    tl.to(cg.scale, { y: 1, duration: T(1.4), ease: "power3.out" }, T(21.7) + (z > 0 ? T(0.3) : 0));
  }

  // lights on
  const lights = [new THREE.PointLight(0xffd9a0, 0, 9, 2), new THREE.PointLight(0xffd9a0, 0, 8, 2)];
  lights[0].position.set(0, 2.0, -0.55);
  lights[1].position.set(2.75, 1.6, -2.2);
  lights.forEach((l) => scene.add(l));
  const on = T(19.6);
  tl.to([coveMat, downMat, pendMat, lampShadeMat], { emissiveIntensity: 1.2, duration: T(1.6), ease: "power2.inOut" }, on);
  tl.to(lights[0], { intensity: 14, duration: T(1.6) }, on);
  tl.to(lights[1], { intensity: 5, duration: T(1.6) }, on);
  tl.to(ctx.hemi, { intensity: 1.15, duration: T(1.6) }, on);

  // ── camera ──
  ctx.camera.position.set(10, 11, 12);
  ctx.target.set(0, 0.3, 0);
  camTo(tl, ctx, [8.5, 7.5, 10], [0, 0.6, -0.4], T(0), T(3.0), "sine.inOut");
  camTo(tl, ctx, [-0.2, 1.45, 8.2], [0, 1.15, -1.4], T(3.4), T(4.2), "power2.inOut");
  camTo(tl, ctx, [0.7, 1.5, 7.9], [0, 1.15, -1.4], T(14), T(8), "sine.inOut");
  camTo(tl, ctx, [-1.4, 1.55, 7.6], [0.3, 1.2, -1.2], T(22.4), T(6.4), "sine.inOut");

  const stages: Stage[] = [
    { at: 0, label: "Empty room shell" },
    { at: T(4.0), label: "Floor & wall finishes" },
    { at: T(8.4), label: "Ceiling design & lighting" },
    { at: T(11.6), label: "Built-in joinery" },
    { at: T(14.4), label: "Furniture assembles" },
    { at: T(19.5), label: "Lighting comes on" },
    { at: T(21.6), label: "Materials & details" },
    { at: T(24.4), label: "The finished interior" },
  ];
  tl.to({}, { duration: 0.01 }, T(29));
  return { tl, stages };
};
