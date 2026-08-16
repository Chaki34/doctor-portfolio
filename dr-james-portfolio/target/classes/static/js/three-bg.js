/* =====================================================================
   THREE-BG.JS — ambient Three.js background canvas
   A calm field of soft translucent spheres drifting behind the page,
   tinted to match the site's blue palette. Purely decorative / no data.
   ===================================================================== */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scene / camera / renderer ---------- */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 22;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  /* ---------- Soft glass orbs ---------- */
  const palette = [0x2f6bff, 0x7fa8ff, 0xbfd4ff, 0xeaf1ff];
  const orbs = [];
  const orbCount = window.innerWidth < 720 ? 10 : 18;

  for (let i = 0; i < orbCount; i++) {
    const radius = Math.random() * 1.6 + 0.6;
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: palette[Math.floor(Math.random() * palette.length)],
      transparent: true,
      opacity: Math.random() * 0.12 + 0.05,
    });
    const orb = new THREE.Mesh(geometry, material);

    orb.position.set(
      (Math.random() - 0.5) * 34,
      (Math.random() - 0.5) * 26,
      (Math.random() - 0.5) * 18
    );
    orb.userData = {
      speed: Math.random() * 0.15 + 0.05,
      offset: Math.random() * Math.PI * 2,
      driftX: (Math.random() - 0.5) * 0.4,
    };
    scene.add(orb);
    orbs.push(orb);
  }

  /* ---------- Faint wireframe ring, subtly rotating (tooth/halo motif) ---------- */
  const ringGeo = new THREE.TorusGeometry(9, 0.02, 8, 100);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x2f6bff, transparent: true, opacity: 0.08 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.set(6, -2, -10);
  ring.rotation.x = Math.PI / 2.4;
  scene.add(ring);

  /* ---------- Resize handling ---------- */
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);

  /* ---------- Gentle parallax on mouse move ---------- */
  let targetX = 0, targetY = 0;
  window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 1.4;
    targetY = (e.clientY / window.innerHeight - 0.5) * 1.4;
  });

  /* ---------- Animate ---------- */
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    orbs.forEach((orb) => {
      const { speed, offset, driftX } = orb.userData;
      orb.position.y += Math.sin(t * speed + offset) * 0.003;
      orb.position.x += Math.cos(t * speed * 0.6 + offset) * 0.0015 * driftX;
    });

    ring.rotation.z = t * 0.02;

    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (-targetY - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  if (!prefersReducedMotion) {
    animate();
  } else {
    renderer.render(scene, camera);
  }
})();
