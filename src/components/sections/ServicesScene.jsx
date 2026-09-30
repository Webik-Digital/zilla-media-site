import { useEffect, useRef, useState } from "react";
import Button from "../Button";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "../../lib/gsapSetup";
import { createMarkGeometry } from "../../lib/zillaMark";
import { services } from "../../data/site";

/* Cheap value-noise fbm — enough for drifting smoke, far cheaper than a
   video layer and it never seams or loops visibly. */
const FOG_FRAG = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uScale;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = vUv * uScale;
    float t = uTime * 0.03;
    float warp = fbm(uv * 1.7 - t * 0.5);
    float n = fbm(uv * 1.9 + vec2(t, -t * 0.55) + warp);
    float m = smoothstep(0.28, 0.92, n);
    float d = distance(vUv, vec2(0.5));
    m *= smoothstep(0.78, 0.1, d);
    gl_FragColor = vec4(uColor, m * uOpacity);
  }
`;

const FOG_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/** Grainy greyscale canvas used as roughness + bump so the block reads stone. */
function makeGrainTexture(size = 512) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    // Two octaves of white noise, biased bright so the surface stays matte.
    const v = 150 + Math.random() * 90 + (Math.random() < 0.06 ? -70 : 0);
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

/**
 * Act three. Paper gives way to smoke, the discipline words scatter, and a
 * stone monolith with the mark inlaid into its face turns to camera while
 * the service list resolves around it.
 */
export default function ServicesScene() {
  const rootRef = useRef(null);
  const canvasHostRef = useRef(null);
  const wordsRef = useRef(null);
  const progress = useRef({ p: 0 });
  const [compact, setCompact] = useState(false);

  // ---- WebGL ------------------------------------------------------------
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const host = canvasHostRef.current;
    if (!host) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }

    const size = {
      w: host.clientWidth || window.innerWidth,
      h: host.clientHeight || window.innerHeight,
    };
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(size.w, size.h);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    host.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, size.w / size.h, 0.1, 100);
    camera.position.set(0, 0, 7.4);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.02);
    scene.environment = envRT.texture;

    // ---- Monolith --------------------------------------------------------
    const grain = makeGrainTexture();
    const block = new THREE.Mesh(
      new RoundedBoxGeometry(2.9, 2.9, 2.9, 4, 0.09),
      new THREE.MeshStandardMaterial({
        color: 0x24262a,
        roughness: 1,
        metalness: 0.12,
        roughnessMap: grain,
        bumpMap: grain,
        bumpScale: 0.35,
        envMapIntensity: 0.5,
      })
    );

    // Sits proud of the face by a hair. With no shadow map, relief alone
    // would be invisible on matte stone — so the mark reads by *material*
    // contrast instead: polished metal against a rough surface, which
    // catches the environment where the stone doesn't.
    const inlay = new THREE.Mesh(
      createMarkGeometry({ size: 1.4, depth: 0.09, bevel: 0.02 }),
      new THREE.MeshPhysicalMaterial({
        color: 0x181c19,
        metalness: 1,
        roughness: 0.11,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        envMapIntensity: 2.6,
        emissive: 0x00ce00,
        emissiveIntensity: 0.14,
      })
    );
    inlay.position.z = 1.49;

    const blockGroup = new THREE.Group();
    blockGroup.add(block, inlay);
    scene.add(blockGroup);

    // ---- Fog -------------------------------------------------------------
    const fogUniforms = [];
    const addFog = (z, scale, opacity, color, w, h) => {
      const uniforms = {
        uTime: { value: Math.random() * 100 },
        uColor: { value: new THREE.Color(color) },
        uOpacity: { value: opacity },
        uScale: { value: scale },
      };
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.ShaderMaterial({
          uniforms,
          vertexShader: FOG_VERT,
          fragmentShader: FOG_FRAG,
          transparent: true,
          depthWrite: false,
        })
      );
      mesh.position.z = z;
      scene.add(mesh);
      fogUniforms.push(uniforms);
      return mesh;
    };

    addFog(-6, 3.2, 0.5, 0x9aa0a6, 42, 26); // deep haze behind the block
    addFog(-1.6, 2.4, 0.34, 0xb4bcc2, 26, 16); // mid bank
    const frontFog = addFog(3.1, 2.0, 0.36, 0xd2d8dc, 20, 13); // wisps in front

    // ---- Lighting --------------------------------------------------------
    const key = new THREE.DirectionalLight(0xffffff, 3.1);
    key.position.set(2.4, 4.4, 4.2);
    scene.add(key);
    const back = new THREE.DirectionalLight(0xcfe6d4, 1.5);
    back.position.set(-4, 1.5, -4);
    scene.add(back);
    const glow = new THREE.PointLight(0x00ce00, 8, 12, 2);
    glow.position.set(-1.2, -1.4, 3.2);
    scene.add(glow);
    scene.add(new THREE.AmbientLight(0x6b7280, 0.9));

    // ---- Loop ------------------------------------------------------------
    const clock = new THREE.Clock();
    let rafId = 0;
    let visible = true;

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      const p = progress.current.p;

      fogUniforms.forEach((u) => (u.uTime.value += dt));
      frontFog.position.x = Math.sin(t * 0.05) * 1.6;

      // Arrives spinning and distant, settles face-on and close. The idle
      // term has to be a sway, not a spin — a constant rate would eventually
      // carry the inlaid face away from camera and never bring it back.
      const settle = THREE.MathUtils.smoothstep(p, 0.18, 0.72);
      blockGroup.rotation.y =
        (1 - settle) * 2.6 + Math.sin(t * 0.16) * 0.26 + Math.sin(t * 0.31) * 0.05;
      blockGroup.rotation.x = (1 - settle) * 0.9 + Math.sin(t * 0.24) * 0.06;
      blockGroup.rotation.z = (1 - settle) * -0.5;
      blockGroup.scale.setScalar(0.34 + settle * 0.29);

      // The mark grows into the face as the block settles.
      const reveal = THREE.MathUtils.smoothstep(p, 0.44, 0.7);
      inlay.scale.setScalar(reveal);
      inlay.material.emissiveIntensity = 0.14 * reveal;

      blockGroup.position.y = (1 - settle) * 1.6 + Math.sin(t * 0.4) * 0.06;
      camera.position.z = 8.6 - settle * 0.9;
      glow.intensity = 3 + settle * 7;

      renderer.render(scene, camera);
    };
    tick();

    const onResize = () => {
      size.w = host.clientWidth || window.innerWidth;
      size.h = host.clientHeight || window.innerHeight;
      camera.aspect = size.w / size.h;
      camera.updateProjectionMatrix();
      renderer.setSize(size.w, size.h);
    };
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(host);

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && !rafId) tick();
        else if (!visible && rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { rootMargin: "150px" }
    );
    io.observe(host);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => m.dispose());
        }
      });
      grain.dispose();
      envRT.texture.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
    // Crossing the breakpoint swaps the whole subtree, which orphans the
    // canvas we appended — rebuild the scene against the new host.
  }, [compact]);

  // Six services can't share one pinned viewport with a monolith on a phone,
  // so narrow screens get a plain stacked layout under the visual instead of
  // the overlay choreography.
  // Reduced motion takes the same route: with the reveal timeline disabled,
  // the overlay layout would stack the list on top of the discipline words.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setCompact(mq.matches || prefersReducedMotion());
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // ---- DOM choreography --------------------------------------------------
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (compact) {
        // Just drive the block's settle off the visual's own scroll range and
        // fade the list in normally.
        const st = ScrollTrigger.create({
          trigger: ".sv-frame",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
          onUpdate: (self) => (progress.current.p = self.progress),
        });
        gsap.fromTo(
          ".sv-item",
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: ".sv-list", start: "top 85%" },
          }
        );
        gsap.fromTo(
          ".sv-outro",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            scrollTrigger: { trigger: ".sv-outro", start: "top 92%" },
          }
        );
        return () => st.kill();
      }

      const split = new SplitText(wordsRef.current.querySelectorAll(".sv-word"), {
        type: "chars",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=320%",
          scrub: 0.9,
          pin: ".sv-frame",
          anticipatePin: 1,
          onUpdate: (self) => (progress.current.p = self.progress),
        },
      });

      // Hold the stacked words, then throw the individual letters apart.
      tl.to({}, { duration: 0.22 })
        .to(
          split.chars,
          {
            x: () => gsap.utils.random(-60, 60) + "vw",
            y: () => gsap.utils.random(-45, 45) + "vh",
            rotate: () => gsap.utils.random(-220, 220),
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            stagger: { amount: 0.16, from: "random" },
          },
          0.22
        )
        .fromTo(
          ".sv-item",
          { opacity: 0, y: 26, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.28,
            ease: "power2.out",
            stagger: 0.05,
          },
          0.52
        )
        .fromTo(
          ".sv-outro",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.2 },
          0.82
        );

      return () => split.revert();
    }, rootRef);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [compact]);

  const half = Math.ceil(services.items.length / 2);
  const columns = [services.items.slice(0, half), services.items.slice(half)];

  const visual = (
    <>
      <div ref={canvasHostRef} className="absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />

      <div
        ref={wordsRef}
        className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center"
      >
        {services.words.map((w) => (
          <span
            key={w}
            className="sv-word display text-[clamp(2.2rem,8.4vw,7.5rem)] uppercase leading-[0.86] text-mist-100"
          >
            {w}
          </span>
        ))}
      </div>
    </>
  );

  const outro = (
    // Tagline removed: the words themselves carry the section.
    <div className="sv-outro flex flex-col items-center gap-4 px-5 anim-hidden md:flex-row md:justify-end md:px-10">
      <Button to={services.cta.to} surface="dark">
        {services.cta.label}
      </Button>
    </div>
  );

  if (compact) {
    return (
      <section ref={rootRef} className="relative z-10 bg-ink">
        <div className="sv-frame relative h-[68svh] w-full overflow-hidden">{visual}</div>

        <div className="sv-list flex flex-col gap-10 px-5 py-16">
          {services.items.map((item) => (
            <div key={item.title} className="sv-item anim-hidden">
              <h3 className="display text-xl text-mist-100">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist-300">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="pb-16">{outro}</div>
      </section>
    );
  }

  return (
    <section ref={rootRef} className="relative z-10 bg-ink">
      <div className="sv-frame relative h-[100svh] w-full overflow-hidden">
        {visual}

        {/* Service list, resolving around the block */}
        <div className="sv-list absolute inset-0 z-20 flex items-center px-5 md:px-10">
          <div className="grid w-full max-w-[1600px] gap-6 md:mx-auto md:grid-cols-3 md:gap-10">
            {columns.map((col, ci) => (
              <div
                key={ci}
                className={`flex flex-col gap-8 md:gap-14 ${
                  ci === 1 ? "md:col-start-3 md:text-right" : ""
                }`}
              >
                {col.map((item) => (
                  <div key={item.title} className="sv-item anim-hidden">
                    <h3 className="display text-lg text-mist-100 md:text-xl">
                      {item.title}
                    </h3>
                    <p
                      className={`mt-2 max-w-[30ch] text-xs leading-relaxed text-mist-300 ${
                        ci === 1 ? "md:ml-auto" : ""
                      }`}
                    >
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-10 z-20">{outro}</div>
      </div>
    </section>
  );
}
