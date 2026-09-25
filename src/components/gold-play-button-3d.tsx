"use client";

import { useEffect, useRef } from "react";

/**
 * WebGL gold YouTube-style play button — the hero backdrop.
 * Same scene setup as the original karat gem (lighting, orbiting sparkles,
 * drag-to-rotate, cursor parallax); only the geometry changed.
 * three.js is imported dynamically so it stays out of the initial bundle.
 */
export function GoldPlayButton3D() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mount.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    const cleanups: Array<() => void> = [];

    void (async () => {
      const [THREE, { RoomEnvironment }] = await Promise.all([
        import("three"),
        import("three/examples/jsm/environments/RoomEnvironment.js"),
      ]);
      if (disposed || !container) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.z = 9.2;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      container.appendChild(renderer.domElement);

      // Metals need something to reflect — without this the gold renders black.
      const pmrem = new THREE.PMREMGenerator(renderer);
      const environment = new RoomEnvironment();
      const envRT = pmrem.fromScene(environment, 0.04);
      environment.dispose();
      scene.environment = envRT.texture;
      pmrem.dispose();

      const group = new THREE.Group();
      scene.add(group);

      // ---- geometry: rounded-rect button body with a cut-through play triangle
      const W = 3.5, H = 2.45, R = 0.5;
      const body = new THREE.Shape();
      body.moveTo(-W / 2 + R, -H / 2);
      body.lineTo(W / 2 - R, -H / 2);
      body.quadraticCurveTo(W / 2, -H / 2, W / 2, -H / 2 + R);
      body.lineTo(W / 2, H / 2 - R);
      body.quadraticCurveTo(W / 2, H / 2, W / 2 - R, H / 2);
      body.lineTo(-W / 2 + R, H / 2);
      body.quadraticCurveTo(-W / 2, H / 2, -W / 2, H / 2 - R);
      body.lineTo(-W / 2, -H / 2 + R);
      body.quadraticCurveTo(-W / 2, -H / 2, -W / 2 + R, -H / 2);

      const triangle = new THREE.Path();
      triangle.moveTo(-0.42, -0.72);
      triangle.lineTo(-0.42, 0.72);
      triangle.lineTo(0.78, 0);
      triangle.closePath();
      body.holes.push(triangle);

      const buttonGeo = new THREE.ExtrudeGeometry(body, {
        depth: 0.5, bevelEnabled: true, bevelThickness: 0.09, bevelSize: 0.09, bevelSegments: 6, curveSegments: 32,
      });
      buttonGeo.center();

      const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.18, metalness: 1, envMapIntensity: 1.0 });
      const button = new THREE.Mesh(buttonGeo, goldMat);
      group.add(button);

      // faceted highlight cage, echoing the original wireframe treatment
      const cageGeo = new THREE.ExtrudeGeometry(body, {
        depth: 0.56, bevelEnabled: true, bevelThickness: 0.14, bevelSize: 0.16, bevelSegments: 2, curveSegments: 14,
      });
      cageGeo.center();
      const cageMat = new THREE.MeshBasicMaterial({ color: 0xf3e296, wireframe: true, transparent: true, opacity: 0.16 });
      const cage = new THREE.Mesh(cageGeo, cageMat);
      group.add(cage);

      // orbiting gold sparkles
      const COUNT = 200;
      const positions = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 14;
        positions[i + 1] = (Math.random() - 0.5) * 10;
        positions[i + 2] = (Math.random() - 0.5) * 10;
      }
      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      // A point sprite is a flat quad, so a bare PointsMaterial draws every
      // sparkle as a square. This paints one soft disc into a texture and uses
      // it as the sprite, which is what rounds them off.
      const disc = document.createElement("canvas");
      disc.width = disc.height = 64;
      const dctx = disc.getContext("2d");
      if (dctx) {
        const grad = dctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, "rgba(255,255,255,1)");
        grad.addColorStop(0.45, "rgba(255,255,255,.75)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        dctx.fillStyle = grad;
        dctx.beginPath();
        dctx.arc(32, 32, 32, 0, Math.PI * 2);
        dctx.fill();
      }
      const discMap = new THREE.CanvasTexture(disc);
      const particleMat = new THREE.PointsMaterial({
        color: 0xd4af37, size: 0.06, map: discMap, alphaMap: discMap,
        transparent: true, opacity: 0.65, depthWrite: false,
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      group.add(particles);

      // ---- studio lighting
      const ambient = new THREE.AmbientLight(0xffffff, 0.4);
      const main = new THREE.PointLight(0xffd700, 3.5, 50); main.position.set(4, 5, 6);
      const rim = new THREE.PointLight(0xf5e296, 2.5, 40); rim.position.set(-6, -3, -4);
      const follow = new THREE.PointLight(0xfffaed, 2, 30); follow.position.set(0, 0, 5);
      scene.add(ambient, main, rim, follow);

      // ---- interaction
      let dragging = false;
      let prev = { x: 0, y: 0 };
      let targetX = 0, targetY = 0;

      const onPointerMove = (event: PointerEvent) => {
        const nx = (event.clientX / innerWidth) * 2 - 1;
        const ny = -(event.clientY / innerHeight) * 2 + 1;
        follow.position.x = nx * 4;
        follow.position.y = ny * 3;
        if (dragging) {
          group.rotation.y += (event.clientX - prev.x) * 0.008;
          group.rotation.x += (event.clientY - prev.y) * 0.008;
          prev = { x: event.clientX, y: event.clientY };
        } else {
          targetY = nx * 0.45;
          targetX = -ny * 0.35;
        }
      };
      const onPointerDown = (event: PointerEvent) => { dragging = true; prev = { x: event.clientX, y: event.clientY }; };
      const onPointerUp = () => { dragging = false; };

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      container.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointerup", onPointerUp);
      cleanups.push(() => {
        window.removeEventListener("pointermove", onPointerMove);
        container.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointerup", onPointerUp);
      });

      // ---- loop
      const clock = new THREE.Clock();
      let frame = 0;
      const animate = () => {
        frame = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        if (!dragging) {
          group.rotation.y += (targetY - group.rotation.y) * 0.05 + 0.0025;
          group.rotation.x += (targetX - group.rotation.x) * 0.05;
        }
        cage.rotation.z = Math.sin(t * 0.25) * 0.04;
        particles.rotation.y = t * 0.02;
        button.position.y = Math.sin(t * 1.2) * 0.12;
        cage.position.y = button.position.y;
        renderer.render(scene, camera);
      };
      cleanups.push(() => cancelAnimationFrame(frame));

      // pause when off-screen so the hero costs nothing further down the page
      let onscreen = false;
      const syncAnimation = () => {
        if (onscreen && !document.hidden) { if (!frame) animate(); }
        else { cancelAnimationFrame(frame); frame = 0; }
      };
      const visibility = new IntersectionObserver(([entry]) => {
        onscreen = entry.isIntersecting;
        syncAnimation();
      }, { threshold: 0 });
      document.addEventListener("visibilitychange", syncAnimation);
      cleanups.push(() => document.removeEventListener("visibilitychange", syncAnimation));
      visibility.observe(container);
      cleanups.push(() => visibility.disconnect());

      const onResize = () => {
        if (!container.clientWidth || !container.clientHeight) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      const sizeObserver = new ResizeObserver(onResize);
      sizeObserver.observe(container);
      cleanups.push(() => sizeObserver.disconnect());

      cleanups.push(() => {
        envRT.dispose();
        renderer.domElement.remove();
        renderer.dispose();
        [buttonGeo, cageGeo, particleGeo].forEach(g => g.dispose());
        [goldMat, cageMat, particleMat].forEach(m => m.dispose());
        discMap.dispose();
      });
    })();

    return () => { disposed = true; cleanups.forEach(fn => fn()); };
  }, []);

  return <div ref={mount} id="webgl-container" className="absolute inset-0 z-0" aria-hidden="true" />;
}
