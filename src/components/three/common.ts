import * as THREE from "three";
import gsap from "gsap";

/** Restrained architectural-model palette: ivory, limestone, charcoal, sage, brass. */
export const C = {
  bg: 0xf4f0e8,
  ivory: 0xf2eee3,
  white: 0xfaf8f3,
  limestone: 0xddd3bf,
  stone: 0xcfc6b2,
  concrete: 0xbdb9af,
  charcoal: 0x2a2927,
  sage: 0x9aa98d,
  sageDark: 0x73846a,
  brass: 0xb08d57,
  water: 0xaebcbc,
  soil: 0xa99679,
  brick: 0xd4c4aa,
  oak: 0xc9a77a,
};

export type V3 = [number, number, number];

export interface Stage {
  /** Timeline time (s) at which this stage begins. */
  at: number;
  label: string;
}

export interface Ctx {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  /** Camera look-at point; tween this, not camera.rotation. */
  target: THREE.Vector3;
  sun: THREE.DirectionalLight;
  hemi: THREE.HemisphereLight;
  mobile: boolean;
}

export interface Built {
  tl: gsap.core.Timeline;
  stages: Stage[];
  /** Per-frame hook (instanced updates etc.). */
  tick?: () => void;
}

export type Builder = (ctx: Ctx) => Built;

export const std = (color: number, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.92, metalness: 0, ...extra });

export const lineMat = (color = C.charcoal, opacity = 0.6) =>
  new THREE.LineBasicMaterial({ color, transparent: true, opacity });

/** Box whose pivot sits on its base, so scale.y animates as growth from the ground. */
export const baseBox = (w: number, h: number, d: number) => {
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate(0, h / 2, 0);
  return g;
};

export function mesh(geo: THREE.BufferGeometry, mat: THREE.Material, pos: V3 = [0, 0, 0], shadow = true) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...pos);
  m.castShadow = shadow;
  m.receiveShadow = true;
  return m;
}

/** Thin CAD-style outline of a mesh. */
export function outline(m: THREE.Mesh, color = C.charcoal, opacity = 0.5) {
  const l = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry, 25), lineMat(color, opacity));
  m.add(l);
  return l;
}

/** Line segments that can be "drawn in" with a timeline. */
export class Lines {
  private pts: number[] = [];
  obj!: THREE.LineSegments;
  count = 0;

  seg(a: V3, b: V3) {
    this.pts.push(...a, ...b);
    return this;
  }
  poly(points: V3[], closed = false) {
    for (let i = 0; i < points.length - 1; i++) this.seg(points[i], points[i + 1]);
    if (closed) this.seg(points[points.length - 1], points[0]);
    return this;
  }
  rect(x0: number, z0: number, x1: number, z1: number, y = 0.02) {
    return this.poly(
      [
        [x0, y, z0],
        [x1, y, z0],
        [x1, y, z1],
        [x0, y, z1],
      ],
      true,
    );
  }
  build(color = C.charcoal, opacity = 0.7) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(this.pts, 3));
    this.count = this.pts.length / 6;
    geo.setDrawRange(0, 0);
    this.obj = new THREE.LineSegments(geo, lineMat(color, opacity));
    return this.obj;
  }
  draw(tl: gsap.core.Timeline, at: number, dur: number, ease = "power2.inOut") {
    const p = { n: 0 };
    tl.to(
      p,
      { n: this.count, duration: dur, ease, onUpdate: () => this.obj.geometry.setDrawRange(0, Math.ceil(p.n) * 2) },
      at,
    );
  }
  fadeOut(tl: gsap.core.Timeline, at: number, dur = 0.8) {
    tl.to(this.obj.material as THREE.Material, { opacity: 0, duration: dur, ease: "power1.out" }, at);
  }
}

/** Deterministic pseudo-random in [0,1) so scenes are identical on every load. */
export const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Show an object and grow it from its base. */
export function rise(tl: gsap.core.Timeline, o: THREE.Object3D, at: number, dur: number, ease = "power3.out") {
  o.visible = false;
  o.scale.y = 0.001;
  tl.set(o, { visible: true }, at);
  tl.to(o.scale, { y: 1, duration: dur, ease }, at);
}

/** Show an object and pop it in uniformly. */
export function pop(tl: gsap.core.Timeline, o: THREE.Object3D, at: number, dur: number, ease = "back.out(1.5)") {
  o.visible = false;
  o.scale.setScalar(0.001);
  tl.set(o, { visible: true }, at);
  tl.to(o.scale, { x: 1, y: 1, z: 1, duration: dur, ease }, at);
}

export function fadeIn(tl: gsap.core.Timeline, m: THREE.Material, at: number, dur: number, to = 1) {
  m.transparent = true;
  m.opacity = 0;
  tl.to(m, { opacity: to, duration: dur, ease: "power1.inOut" }, at);
}

export function camTo(tl: gsap.core.Timeline, ctx: Ctx, pos: V3, look: V3, at: number, dur: number, ease = "power2.inOut") {
  tl.to(ctx.camera.position, { x: pos[0], y: pos[1], z: pos[2], duration: dur, ease }, at);
  tl.to(ctx.target, { x: look[0], y: look[1], z: look[2], duration: dur, ease }, at);
}

/** Procedural canvas texture helper (planks, garden backdrops…). */
export function canvasTexture(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, repeat?: [number, number]) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(...repeat);
  }
  return t;
}

/** Instanced trees (trunk + crown) with staggered pop-in driven by one progress value. */
export class Trees {
  trunks: THREE.InstancedMesh;
  crowns: THREE.InstancedMesh;
  private items: { x: number; z: number; s: number; delay: number }[] = [];
  p = { v: 0 };
  private m = new THREE.Matrix4();
  private q = new THREE.Quaternion();

  constructor(list: { x: number; z: number; s: number }[], color = C.sage) {
    const n = list.length;
    const trunk = new THREE.CylinderGeometry(0.12, 0.18, 1, 6);
    trunk.translate(0, 0.5, 0);
    const crown = new THREE.IcosahedronGeometry(1, 1);
    this.trunks = new THREE.InstancedMesh(trunk, std(0x8b7960), n);
    this.crowns = new THREE.InstancedMesh(crown, std(color, { flatShading: true }), n);
    this.trunks.castShadow = this.crowns.castShadow = true;
    this.trunks.receiveShadow = this.crowns.receiveShadow = true;
    list.forEach((t, i) => this.items.push({ ...t, delay: rnd(i + 3) * 0.55 }));
    this.apply();
  }

  apply() {
    const p = this.p.v;
    this.items.forEach((t, i) => {
      const k = Math.min(1, Math.max(0, (p - t.delay) / 0.45));
      const e = 1 - Math.pow(1 - k, 3);
      const s = Math.max(0.0001, t.s * e);
      this.m.compose(new THREE.Vector3(t.x, 0, t.z), this.q, new THREE.Vector3(s, s * 1.1, s));
      this.trunks.setMatrixAt(i, this.m);
      this.m.compose(new THREE.Vector3(t.x, t.s * 1.5 * e, t.z), this.q, new THREE.Vector3(s * 1.1, s * 1.15, s * 1.1));
      this.crowns.setMatrixAt(i, this.m);
    });
    this.trunks.instanceMatrix.needsUpdate = true;
    this.crowns.instanceMatrix.needsUpdate = true;
  }

  animate(tl: gsap.core.Timeline, at: number, dur: number) {
    tl.to(this.p, { v: 1.2, duration: dur, ease: "none", onUpdate: () => this.apply() }, at);
  }

  get group() {
    const g = new THREE.Group();
    g.add(this.trunks, this.crowns);
    return g;
  }
}
