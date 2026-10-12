import * as THREE from "three";
import gsap from "gsap";
import { C, type Built, type Builder, type Ctx } from "./common";

export type SceneId = "home" | "architecture" | "interior" | "construction";

export interface StageEvents {
  onStage: (index: number, label: string, total: number) => void;
  onDone: () => void;
}

export interface Controller {
  start(): void;
  pause(): void;
  resume(): void;
  replay(): void;
  skip(): void;
  /** Jump to a time in seconds (used for QA/debugging). */
  seek(t: number): void;
  readonly duration: number;
  dispose(): void;
}

async function load(id: SceneId): Promise<Builder> {
  switch (id) {
    case "home": {
      const { buildMasterplan } = await import("./scenes/masterplan");
      return buildMasterplan("home");
    }
    case "architecture": {
      const { buildMasterplan } = await import("./scenes/masterplan");
      return buildMasterplan("architecture");
    }
    case "interior":
      return (await import("./scenes/interior")).buildInterior;
    case "construction":
      return (await import("./scenes/construction")).buildConstruction;
  }
}

export async function createStage(host: HTMLElement, canvas: HTMLCanvasElement, id: SceneId, ev: StageEvents): Promise<Controller> {
  const mobile = window.matchMedia("(max-width: 899px)").matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(C.bg);
  if (id !== "interior") scene.fog = new THREE.Fog(C.bg, 230, 520);

  const hemi = new THREE.HemisphereLight(0xfff6ea, 0xd9d1c0, 0.8);
  const sun = new THREE.DirectionalLight(0xfff3e4, 1.7);
  sun.position.set(-50, 90, 45);
  sun.castShadow = true;
  sun.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  sun.shadow.camera.left = -85;
  sun.shadow.camera.right = 85;
  sun.shadow.camera.top = 85;
  sun.shadow.camera.bottom = -85;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 420;
  scene.add(hemi, sun);

  const portrait = host.clientHeight > host.clientWidth;
  const baseFov = id === "interior" ? 40 : id === "construction" ? 32 : 34;
  const camera = new THREE.PerspectiveCamera(portrait ? Math.min(baseFov * 1.55, 60) : baseFov, 1, 0.3, 800);
  const target = new THREE.Vector3();
  const ctx: Ctx = { scene, camera, renderer, target, sun, hemi, mobile };

  const build = await load(id);
  const built: Built = build(ctx);
  const { tl, stages } = built;

  // ── sizing: push the scene to the right (desktop) or up (mobile) so the headline owns the other side ──
  const layout = () => {
    const w = Math.max(1, host.clientWidth);
    const h = Math.max(1, host.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const narrow = w < 900;
    camera.fov = h > w ? Math.min(baseFov * 1.55, 62) : baseFov;
    if (narrow) camera.setViewOffset(w, h, 0, h * 0.2, w, h);
    else camera.setViewOffset(w, h, -w * (id === "interior" ? 0.2 : 0.13), 0, w, h);
    camera.updateProjectionMatrix();
    dirty = true;
  };
  let dirty = true;
  const ro = new ResizeObserver(layout);
  ro.observe(host);
  layout();

  // ── stage reporting ──
  let stageIdx = -1;
  const report = () => {
    const t = tl.time();
    let idx = 0;
    for (let i = 0; i < stages.length; i++) if (t + 0.001 >= stages[i].at) idx = i;
    if (idx !== stageIdx) {
      stageIdx = idx;
      ev.onStage(idx, stages[idx].label, stages.length);
    }
  };
  let finished = false;
  tl.eventCallback("onUpdate", () => {
    dirty = true;
    report();
  });
  tl.eventCallback("onComplete", () => {
    finished = true;
    rest.copy(camera.position);
    ev.onDone();
  });

  // ── gentle pointer parallax once the sequence has finished (direct, optional interaction) ──
  const rest = new THREE.Vector3();
  const look = { yaw: 0, pitch: 0, ty: 0, tp: 0 };
  const onMove = (e: PointerEvent) => {
    if (!finished) return;
    const r = host.getBoundingClientRect();
    look.ty = ((e.clientX - r.left) / r.width - 0.5) * -0.28;
    look.tp = ((e.clientY - r.top) / r.height - 0.5) * 0.12;
  };
  host.addEventListener("pointermove", onMove, { passive: true });

  const v = new THREE.Vector3();
  const frame = () => {
    const parallaxing = finished && (Math.abs(look.yaw - look.ty) > 0.0004 || Math.abs(look.pitch - look.tp) > 0.0004);
    if (!dirty && !tl.isActive() && !parallaxing) return;
    if (finished) {
      look.yaw += (look.ty - look.yaw) * 0.06;
      look.pitch += (look.tp - look.pitch) * 0.06;
      v.copy(rest).sub(target);
      const r = Math.hypot(v.x, v.z);
      const a = Math.atan2(v.z, v.x) + look.yaw;
      const lift = v.y + r * look.pitch;
      camera.position.set(target.x + Math.cos(a) * r, target.y + lift, target.z + Math.sin(a) * r);
    }
    camera.lookAt(target);
    built.tick?.();
    renderer.render(scene, camera);
    dirty = false;
  };
  gsap.ticker.add(frame);

  // First frame so the canvas is never blank.
  camera.lookAt(target);
  renderer.render(scene, camera);

  return {
    start() {
      finished = false;
      stageIdx = -1;
      tl.restart();
    },
    pause: () => tl.pause(),
    resume: () => {
      if (!finished) tl.resume();
    },
    replay() {
      finished = false;
      look.ty = look.tp = look.yaw = look.pitch = 0;
      stageIdx = -1;
      tl.restart();
    },
    skip() {
      tl.progress(1);
      finished = true;
      rest.copy(camera.position);
      report();
      dirty = true;
      ev.onDone();
    },
    seek(t: number) {
      tl.pause();
      tl.time(t, false);
      report();
      dirty = true;
    },
    duration: tl.duration(),
    dispose() {
      gsap.ticker.remove(frame);
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      tl.kill();
      const disposeMat = (m: THREE.Material) => {
        for (const val of Object.values(m)) if (val && (val as THREE.Texture).isTexture) (val as THREE.Texture).dispose();
        m.dispose();
      };
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach(disposeMat);
        else if (mat) disposeMat(mat);
      });
      renderer.dispose();
    },
  };
}
