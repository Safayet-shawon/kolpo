import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { C, baseBox, rnd, std } from "./common";

/** Compact, stylised living-room furniture (metres). Every group's origin is on the floor at its centre. */

const rbox = (w: number, h: number, d: number, r = 0.05) => new RoundedBoxGeometry(w, h, d, 3, r);

function shade<T extends THREE.Object3D>(g: T): T {
  g.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh) {
      m.castShadow = true;
      m.receiveShadow = true;
    }
  });
  return g;
}

function part(g: THREE.Group, geo: THREE.BufferGeometry, m: THREE.Material, pos: [number, number, number], rot?: [number, number, number]) {
  const x = new THREE.Mesh(geo, m);
  x.position.set(...pos);
  if (rot) x.rotation.set(...rot);
  g.add(x);
  return x;
}

export interface FlatFurniture {
  rug: THREE.Group;
  sofa: THREE.Group;
  table: THREE.Group;
  chairL: THREE.Group;
  chairR: THREE.Group;
  lamp: THREE.Group;
  plant: THREE.Group;
  pendant: THREE.Group;
  deco: THREE.Group;
  /** Materials whose emissiveIntensity animates when the lights come on. */
  glow: THREE.MeshStandardMaterial[];
  /** Light colour used by the interior's point lights. */
  warm: THREE.Color;
}

export function makeFlatFurniture(): FlatFurniture {
  const linen = std(0x2fa89d, { roughness: 1 });
  const boucle = std(0xf29a80, { roughness: 1 });
  const travertine = std(0xe0d3b9, { roughness: 0.8 });
  const darkWood = std(0x6b5640, { roughness: 0.6 });
  const brass = std(C.brass, { metalness: 0.65, roughness: 0.35 });
  const warm = new THREE.Color(0xffd9a0);

  const rug = new THREE.Group();
  part(rug, new THREE.BoxGeometry(3.3, 0.02, 2.3), std(0xf6d58a, { roughness: 1 }), [0, 0.01, 0]);

  const sofa = new THREE.Group();
  part(sofa, rbox(2.4, 0.4, 0.95), linen, [0, 0.32, 0]);
  part(sofa, rbox(2.4, 0.55, 0.22), linen, [0, 0.72, -0.37]);
  part(sofa, rbox(0.22, 0.5, 0.95), linen, [-1.09, 0.5, 0]);
  part(sofa, rbox(0.22, 0.5, 0.95), linen, [1.09, 0.5, 0]);
  part(sofa, rbox(0.98, 0.16, 0.72, 0.07), linen, [-0.5, 0.58, 0.07]);
  part(sofa, rbox(0.98, 0.16, 0.72, 0.07), linen, [0.5, 0.58, 0.07]);
  part(sofa, rbox(0.92, 0.42, 0.16, 0.07), linen, [-0.5, 0.82, -0.2], [-0.2, 0, 0]);
  part(sofa, rbox(0.92, 0.42, 0.16, 0.07), linen, [0.5, 0.82, -0.2], [-0.2, 0, 0]);
  for (const x of [-1, 1]) for (const z of [-0.38, 0.38]) part(sofa, new THREE.CylinderGeometry(0.025, 0.02, 0.12, 8), darkWood, [x, 0.06, z]);
  part(sofa, rbox(0.42, 0.36, 0.12, 0.05), std(C.sage, { roughness: 1 }), [-0.85, 0.84, -0.02], [-0.25, 0.3, 0]);

  const table = new THREE.Group();
  part(table, new THREE.CylinderGeometry(0.55, 0.55, 0.06, 48), travertine, [0, 0.38, 0]);
  part(table, new THREE.CylinderGeometry(0.28, 0.32, 0.35, 32), std(0xc9bda4), [0, 0.18, 0]);

  const chair = () => {
    const g = new THREE.Group();
    part(g, rbox(0.82, 0.38, 0.8, 0.07), boucle, [0, 0.32, 0]);
    part(g, rbox(0.82, 0.56, 0.18, 0.08), boucle, [0, 0.6, -0.33], [-0.12, 0, 0]);
    part(g, rbox(0.16, 0.34, 0.8, 0.06), boucle, [-0.33, 0.52, 0]);
    part(g, rbox(0.16, 0.34, 0.8, 0.06), boucle, [0.33, 0.52, 0]);
    for (const x of [-0.3, 0.3]) for (const z of [-0.3, 0.3]) part(g, new THREE.CylinderGeometry(0.025, 0.02, 0.14, 8), darkWood, [x, 0.07, z]);
    return g;
  };
  const chairL = chair();
  const chairR = chair();

  const lampShade = new THREE.MeshStandardMaterial({ color: 0xf3ead8, emissive: warm, emissiveIntensity: 0, side: THREE.DoubleSide });
  const lamp = new THREE.Group();
  part(lamp, new THREE.CylinderGeometry(0.16, 0.18, 0.03, 24), brass, [0, 0.015, 0]);
  part(lamp, new THREE.CylinderGeometry(0.014, 0.014, 1.55, 8), brass, [0, 0.8, 0]);
  part(lamp, new THREE.CylinderGeometry(0.2, 0.26, 0.34, 28, 1, true), lampShade, [0, 1.65, 0]);

  const plant = new THREE.Group();
  part(plant, new THREE.CylinderGeometry(0.26, 0.2, 0.42, 24), std(C.limestone), [0, 0.21, 0]);
  const leaf = std(C.sageDark, { flatShading: true });
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    const r = 0.18 + rnd(i) * 0.12;
    const s = part(plant, new THREE.IcosahedronGeometry(0.2 + rnd(i + 4) * 0.12, 0), leaf, [Math.cos(a) * r, 0.62 + rnd(i + 9) * 0.55, Math.sin(a) * r]);
    s.scale.y = 1.4;
  }

  // pendant hangs DOWN from its origin (the ceiling); scale.y animates the drop
  const pendMat = new THREE.MeshStandardMaterial({ color: 0xfff3dc, emissive: warm, emissiveIntensity: 0, side: THREE.DoubleSide });
  const pendant = new THREE.Group();
  part(pendant, new THREE.CylinderGeometry(0.008, 0.008, 1.2, 6), std(C.charcoal), [0, -0.6, 0]);
  const dome = part(pendant, new THREE.SphereGeometry(0.26, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), brass, [0, -1.2, 0]);
  dome.scale.y = 0.8;
  const glow = part(pendant, new THREE.CircleGeometry(0.24, 28), pendMat, [0, -1.202, 0], [Math.PI / 2, 0, 0]);
  void glow;

  const deco = new THREE.Group();
  part(deco, baseBox(0.34, 0.04, 0.24), std(0xe8e0d0), [0, 0.41, 0], [0, 0.3, 0]);
  part(deco, baseBox(0.3, 0.035, 0.2), std(C.sageDark), [0, 0.45, 0], [0, 0.1, 0]);
  part(deco, new THREE.CylinderGeometry(0.06, 0.08, 0.22, 20), std(0xf3efe6), [0.2, 0.52, 0.12]);

  [rug, sofa, table, chairL, chairR, lamp, plant, pendant, deco].forEach(shade);
  return { rug, sofa, table, chairL, chairR, lamp, plant, pendant, deco, glow: [lampShade, pendMat], warm };
}
