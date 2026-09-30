import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { ScrollTrigger, prefersReducedMotion } from "../../lib/gsapSetup";
import { createMarkGeometry, MARK_PATH } from "../../lib/zillaMark";

/**
 * Act-one WebGL layer: the Zilla mark as a large, centred solid in near-black
 * graphite, edges picked out by a green Fresnel rim. It swings on a slow arc
 * under the hero, then shatters triangle-by-triangle as the page scrolls into
 * the About copy.
 *
 * Fixed-position canvas so it can span the hero and About sections without
 * either of them owning it.
 */
export default function HeroCanvas({ triggerId = "act-one" }) {
  const hostRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const host = hostRef.current;
    if (!host) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return; // No WebGL — the static fallback below stays visible.
    }

    // WebGL is live, so retire the static mark.
    const fallback = host.querySelector("[data-webgl-fallback]");
    if (fallback) fallback.style.display = "none";

    // In dev the stylesheet can land after this effect, so the host measures
    // 0x0 on first read — fall back to the viewport and let the
    // ResizeObserver below correct it the moment layout settles.
    const size = {
      w: host.clientWidth || window.innerWidth,
      h: host.clientHeight || window.innerHeight,
    };
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(size.w, size.h);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.86;
    host.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, size.w / size.h, 0.1, 100);
    camera.position.set(0, 0, 6.4);

    // Studio reflections. Room env is neutral and bright, so it gets dialled
    // right down — the mark should read as near-black graphite catching light,
    // not as chrome.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.02);
    scene.environment = envRT.texture;

    // ---- The mark ---------------------------------------------------------
    const uBlast = { value: 0 };
    const uTime = { value: 0 };
    // Deliberately a shade under the brand green (#00ce00) — not a mistake to
    // "correct" back to the token. Note THREE.Color converts sRGB to linear,
    // so a given step in the hex lands roughly twice as hard on screen: this
    // is ~9% down in sRGB but ~20% down in actual light.
    const uRim = { value: new THREE.Color(0x00b806) };
    const uRimStrength = { value: 1.7 };

    let geo = createMarkGeometry({ size: 2.75, depth: 0.46, bevel: 0.04 });
    // The shatter needs one independent triangle per shard. ExtrudeGeometry
    // already comes back unindexed, so only convert if that ever changes.
    if (geo.index) geo = geo.toNonIndexed();

    // Per-triangle centroid + random seed drive the shatter entirely on the
    // GPU: no per-frame CPU work once it's uploaded.
    const posAttr = geo.attributes.position;
    const triCount = posAttr.count;
    const centroid = new Float32Array(triCount * 3);
    const seed = new Float32Array(triCount * 3);
    for (let i = 0; i < triCount; i += 3) {
      const cx = (posAttr.getX(i) + posAttr.getX(i + 1) + posAttr.getX(i + 2)) / 3;
      const cy = (posAttr.getY(i) + posAttr.getY(i + 1) + posAttr.getY(i + 2)) / 3;
      const cz = (posAttr.getZ(i) + posAttr.getZ(i + 1) + posAttr.getZ(i + 2)) / 3;
      const r = [Math.random(), Math.random(), Math.random()];
      for (let k = 0; k < 3; k++) {
        const o = (i + k) * 3;
        centroid[o] = cx;
        centroid[o + 1] = cy;
        centroid[o + 2] = cz;
        seed[o] = r[0];
        seed[o + 1] = r[1];
        seed[o + 2] = r[2];
      }
    }
    geo.setAttribute("aCentroid", new THREE.BufferAttribute(centroid, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 3));

    const markMat = new THREE.MeshPhysicalMaterial({
      // Near-black graphite. The form is read from white bevel highlights and
      // the green rim below — deliberately no iridescence, which is what was
      // throwing the purple/prism cast.
      color: 0x090b0a,
      metalness: 1,
      roughness: 0.3,
      clearcoat: 0.32,
      clearcoatRoughness: 0.45,
      envMapIntensity: 0.52,
      side: THREE.DoubleSide,
    });

    const EXPLODE_HEAD = /* glsl */ `
      uniform float uBlast;
      uniform float uTime;
      attribute vec3 aCentroid;
      attribute vec3 aSeed;
      mat3 zmRot(vec3 axis, float a) {
        axis = normalize(axis);
        float s = sin(a), c = cos(a), t = 1.0 - c;
        return mat3(
          t*axis.x*axis.x + c,        t*axis.x*axis.y - s*axis.z, t*axis.x*axis.z + s*axis.y,
          t*axis.x*axis.y + s*axis.z, t*axis.y*axis.y + c,        t*axis.y*axis.z - s*axis.x,
          t*axis.x*axis.z - s*axis.y, t*axis.y*axis.z + s*axis.x, t*axis.z*axis.z + c
        );
      }
    `;

    markMat.onBeforeCompile = (shader) => {
      shader.uniforms.uBlast = uBlast;
      shader.uniforms.uTime = uTime;
      shader.uniforms.uRim = uRim;
      shader.uniforms.uRimStrength = uRimStrength;

      shader.vertexShader = EXPLODE_HEAD + shader.vertexShader;

      shader.vertexShader = shader.vertexShader.replace(
        "#include <beginnormal_vertex>",
        /* glsl */ `
        #include <beginnormal_vertex>
        vec3 zmAxis = normalize(aSeed * 2.0 - 1.0 + vec3(0.001));
        float zmAngle = uBlast * (1.6 + aSeed.x * 7.0);
        if (uBlast > 0.0001) objectNormal = zmRot(zmAxis, zmAngle) * objectNormal;
        `
      );

      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        /* glsl */ `
        #include <begin_vertex>
        if (uBlast > 0.0001) {
          float b = uBlast;
          vec3 c = aCentroid;
          // Spin each shard about its own centroid, then push it outward
          // along a jittered radial so the burst never looks like a
          // uniform scale-up.
          vec3 local = zmRot(zmAxis, zmAngle) * (transformed - c);
          vec3 dir = normalize(c + (aSeed - 0.5) * 1.3 + vec3(0.0001));
          float drift = sin(uTime * 0.8 + aSeed.z * 6.283) * 0.12 * b;
          transformed = c + local + dir * b * (0.9 + aSeed.y * 3.6) + vec3(0.0, drift, 0.0);
        }
        `
      );

      // Green Fresnel rim. Added before tone mapping so it's graded with the
      // rest of the frame and crosses the bloom threshold on the silhouette
      // only — the flat faces stay black.
      shader.fragmentShader = `
        uniform vec3 uRim;
        uniform float uRimStrength;
      ` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <opaque_fragment>",
        /* glsl */ `
        #include <opaque_fragment>
        // Power 6 keeps this to roughly the outer 15% of each face. Anything
        // softer floods the flat slabs and the whole mark turns green.
        float zmFacing = abs(dot(normalize(vNormal), normalize(vViewPosition)));
        gl_FragColor.rgb += uRim * pow(1.0 - zmFacing, 6.0) * uRimStrength;
        `
      );
    };
    markMat.customProgramCacheKey = () => "zilla-mark-v2";

    const mark = new THREE.Mesh(geo, markMat);
    const markGroup = new THREE.Group();
    markGroup.add(mark);
    markGroup.rotation.set(-0.18, -0.5, 0.05);
    scene.add(markGroup);

    // ---- Lighting ---------------------------------------------------------
    // One white key for the bevel highlights, one dim green wash from behind
    // to seat the rim, and almost nothing else.
    const key = new THREE.DirectionalLight(0xffffff, 1.7);
    key.position.set(3.5, 4.5, 5);
    scene.add(key);

    // Cool fill from the opposite side so left-facing planes don't collapse
    // into the same black as the right-facing ones.
    const fill = new THREE.DirectionalLight(0xbcd4c4, 0.45);
    fill.position.set(-4.5, 0.5, 2.5);
    scene.add(fill);

    const rim = new THREE.PointLight(0x00ce00, 9, 16, 2);
    rim.position.set(-4.6, -2.2, -4.2);
    scene.add(rim);

    scene.add(new THREE.AmbientLight(0x141a15, 0.6));

    // ---- Post ------------------------------------------------------------
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(size.w, size.h),
      0.55,
      0.7,
      0.62
    );
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    composer.setSize(size.w, size.h);

    // ---- Pointer ----------------------------------------------------------
    // Parallax only — the mark leans toward the cursor.
    const pointer = { x: 0, y: 0 };
    const onMove = (e) => {
      const r = host.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // ---- Scroll choreography ---------------------------------------------
    const scrollState = { p: 0 };
    const trigger = document.getElementById(triggerId);
    let st;
    if (trigger) {
      st = ScrollTrigger.create({
        trigger,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          scrollState.p = self.progress;
        },
      });
    }

    // ---- Loop -------------------------------------------------------------
    const clock = new THREE.Clock();
    let rafId = 0;
    let idleRot = 0;

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      uTime.value += dt;

      const p = scrollState.p;
      uBlast.value = THREE.MathUtils.clamp((p - 0.26) / 0.46, 0, 1) * 1.9;

      // The mark is a flat form, so a full spin would parade it edge-on as a
      // featureless slab. It swings through a wide arc instead and never
      // crosses the profile — the scroll adds a one-way turn on top.
      idleRot += dt * 0.22;
      markGroup.rotation.y =
        -0.42 + Math.sin(idleRot) * 0.85 + pointer.x * 0.24 + p * 1.1;
      markGroup.rotation.x = -0.18 + Math.sin(uTime.value * 0.35) * 0.07 - pointer.y * 0.16;
      markGroup.rotation.z = 0.05 + Math.sin(uTime.value * 0.22) * 0.04;

      // Centred. Narrow screens get a smaller copy so a tight frustum doesn't
      // blow it up to fill the phone.
      const narrow = size.w < 760;
      markGroup.scale.setScalar(narrow ? 0.68 : 1);
      markGroup.position.y =
        p * 1.1 + Math.sin(uTime.value * 0.5) * 0.05 - (narrow ? 0.45 : 0.18);

      camera.position.z = 6.4 + p * 2.2;
      camera.position.x = pointer.x * 0.16;
      camera.position.y = pointer.y * 0.1;
      camera.lookAt(0, markGroup.position.y * 0.4, 0);

      rim.intensity = 9 + Math.sin(uTime.value * 1.6) * 2.5;
      // The rim fades out as the mark breaks up, so the shards read as cold
      // debris rather than a swarm of glowing chips.
      uRimStrength.value = 1.7 * (1 - THREE.MathUtils.smoothstep(p, 0.3, 0.7)) + 0.2;

      // Hand the frame back to the DOM before act two starts.
      host.style.opacity = String(1 - THREE.MathUtils.smoothstep(p, 0.8, 0.99));

      composer.render();
    };
    tick();

    // ---- Resize -----------------------------------------------------------
    const onResize = () => {
      size.w = host.clientWidth || window.innerWidth;
      size.h = host.clientHeight || window.innerHeight;
      camera.aspect = size.w / size.h;
      camera.updateProjectionMatrix();
      renderer.setSize(size.w, size.h);
      composer.setSize(size.w, size.h);
      bloom.setSize(size.w, size.h);
    };
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(host);

    // Pause the loop when act one is off-screen — no point burning GPU on a
    // scene nobody can see.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !rafId) tick();
        else if (!entry.isIntersecting && rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { rootMargin: "200px" }
    );
    if (trigger) io.observe(trigger);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
      st?.kill();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      geo.dispose();
      markMat.dispose();
      envRT.texture.dispose();
      pmrem.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [triggerId]);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    >
      {/* Static stand-in for reduced-motion and no-WebGL visitors. */}
      <div
        data-webgl-fallback
        className="absolute inset-0 flex items-center justify-center"
      >
        <svg viewBox="0 0 100 100" className="h-[38vmin] w-[38vmin] opacity-[0.07]">
          <path d={MARK_PATH} fill="#00ce00" />
        </svg>
      </div>
    </div>
  );
}
