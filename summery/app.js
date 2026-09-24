/**
 * BEHIND THE KARATS — Production JavaScript
 * Features:
 * 1. Three.js 3D Faceted Karat Polyhedron with metallic shaders & cursor illumination
 * 2. 3D Perspective Card Tilt with dynamic specular sheen
 * 3. Intersection Observer for kinetic scroll reveals & timeline progression
 * 4. Episode filtering & High-end video modal player
 * 5. Interactive story nomination form with validation & state transitions
 * 6. Web Audio API luxury acoustic feedback & ambient sound toggle
 * 7. Smooth custom cursor follower
 */

document.addEventListener('DOMContentLoaded', () => {
  initCursorFollower();
  initThreeJSScene();
  init3DCardTilt();
  initScrollAnimations();
  initTimelineProgress();
  initEpisodeFiltering();
  initVideoModal();
  initStoryForm();
  initHeaderScroll();
  initMobileMenu();
  initAudioExperience();
});

/* ==========================================================================
   1. CUSTOM AMBIENT GOLD CURSOR
   ========================================================================== */
function initCursorFollower() {
  const glow = document.getElementById('cursor-glow');
  const dot = document.getElementById('cursor-dot');
  if (!glow || !dot) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;
  let dotX = mouseX;
  let dotY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderCursor() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    dotX += (mouseX - dotX) * 0.45;
    dotY += (mouseY - dotY) * 0.45;

    glow.style.transform = `translate3d(${glowX - 160}px, ${glowY - 160}px, 0)`;
    dot.style.transform = `translate3d(${dotX - 3}px, ${dotY - 3}px, 0)`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);
}

/* ==========================================================================
   2. THREE.JS 3D GOLDEN KARAT CRYSTAL SCENE
   ========================================================================== */
function initThreeJSScene() {
  const container = document.getElementById('webgl-container');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 7.5;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  container.appendChild(renderer.domElement);

  // Group to hold all 3D Karat components
  const karatGroup = new THREE.Group();
  scene.add(karatGroup);

  // Core 3D Geometry: Faceted Gold Polyhedron
  const coreGeometry = new THREE.IcosahedronGeometry(2.1, 0);
  const coreMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.22,
    metalness: 0.92,
    flatShading: true,
  });
  const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
  karatGroup.add(coreMesh);

  // Outer Golden Wireframe Facet Cage
  const wireGeometry = new THREE.IcosahedronGeometry(2.35, 1);
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0xf3e296,
    wireframe: true,
    transparent: true,
    opacity: 0.28,
  });
  const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
  karatGroup.add(wireMesh);

  // Surrounding Orbiting Karat Particles (Gold Sparkles)
  const particleCount = 200;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 14;
    positions[i + 1] = (Math.random() - 0.5) * 10;
    positions[i + 2] = (Math.random() - 0.5) * 10;
  }
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xd4af37,
    size: 0.045,
    transparent: true,
    opacity: 0.65,
  });
  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  karatGroup.add(particleSystem);

  // Studio Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const mainLight = new THREE.PointLight(0xffd700, 3.5, 50);
  mainLight.position.set(4, 5, 6);
  scene.add(mainLight);

  const rimLight = new THREE.PointLight(0xf5e296, 2.5, 40);
  rimLight.position.set(-6, -3, -4);
  scene.add(rimLight);

  const cursorFollowLight = new THREE.PointLight(0xfffaed, 2, 30);
  cursorFollowLight.position.set(0, 0, 5);
  scene.add(cursorFollowLight);

  // Interactive Drag & Parallax
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotationX = 0;
  let targetRotationY = 0;

  window.addEventListener('mousemove', (e) => {
    const mouseNormalizedX = (e.clientX / window.innerWidth) * 2 - 1;
    const mouseNormalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
    cursorFollowLight.position.x = mouseNormalizedX * 4;
    cursorFollowLight.position.y = mouseNormalizedY * 3;

    if (!isDragging) {
      targetRotationY = mouseNormalizedX * 0.45;
      targetRotationX = -mouseNormalizedY * 0.35;
    }
  });

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    karatGroup.rotation.y += deltaX * 0.008;
    karatGroup.rotation.x += deltaY * 0.008;

    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  // Touch Support
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMousePosition.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.y;

    karatGroup.rotation.y += deltaX * 0.008;
    karatGroup.rotation.x += deltaY * 0.008;

    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });

  // Animation Loop
  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    if (!isDragging) {
      karatGroup.rotation.y += (targetRotationY - karatGroup.rotation.y) * 0.05 + 0.0025;
      karatGroup.rotation.x += (targetRotationX - karatGroup.rotation.x) * 0.05;
    }

    wireMesh.rotation.y = -elapsedTime * 0.08;
    wireMesh.rotation.z = elapsedTime * 0.05;
    particleSystem.rotation.y = elapsedTime * 0.02;

    // Gentle levitation
    coreMesh.position.y = Math.sin(elapsedTime * 1.2) * 0.12;
    wireMesh.position.y = Math.sin(elapsedTime * 1.2) * 0.12;

    renderer.render(scene, camera);
  }
  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}

/* ==========================================================================
   3. 3D PERSPECTIVE CARD TILT & SPECULAR SHEEN
   ========================================================================== */
function init3DCardTilt() {
  const cards = document.querySelectorAll('.card-3d');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px)`;
      
      // Update dynamic glare position
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  });
}

/* ==========================================================================
   4. INTERSECTION OBSERVER SCROLL REVEALS
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-fade');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   5. INTERACTIVE TIMELINE PROGRESSION
   ========================================================================== */
function initTimelineProgress() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (!timelineItems.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active-node');
        const badge = entry.target.querySelector('.rounded-full');
        if (badge) {
          badge.style.transform = 'scale(1.15)';
          badge.style.boxShadow = '0 0 25px rgba(212, 175, 55, 0.8)';
        }
      }
    });
  }, {
    threshold: 0.35
  });

  timelineItems.forEach(item => observer.observe(item));
}

/* ==========================================================================
   6. EPISODE FILTERING
   ========================================================================== */
function initEpisodeFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const episodeCards = document.querySelectorAll('.episode-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      episodeCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. HIGH-END VIDEO MODAL PLAYER
   ========================================================================== */
function initVideoModal() {
  const modal = document.getElementById('video-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const triggers = document.querySelectorAll('.play-trigger');
  const modalTitle = document.getElementById('modal-video-title');
  const modalGuest = document.getElementById('modal-video-guest');

  if (!modal) return;

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = trigger.getAttribute('data-video-title') || 'Behind The Karats Dialogue';
      const guest = trigger.getAttribute('data-video-guest') || 'Featured Industry Voice';
      
      if (modalTitle) modalTitle.textContent = title;
      if (modalGuest) modalGuest.innerHTML = guest;

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   8. STORY PITCH FORM VALIDATION & SUBMISSION STATE
   ========================================================================== */
function initStoryForm() {
  const form = document.getElementById('story-form');
  const successState = document.getElementById('form-success-state');
  const resetBtn = document.getElementById('reset-form-btn');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Fields to validate
    const fields = [
      { id: 'fullName', validator: val => val.trim().length >= 2 },
      { id: 'phone', validator: val => val.trim().length >= 7 },
      { id: 'email', validator: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) },
      { id: 'profession', validator: val => val.trim().length >= 2 },
      { id: 'storyPitch', validator: val => val.trim().length >= 10 }
    ];

    fields.forEach(field => {
      const input = document.getElementById(field.id);
      if (!input) return;
      const errorMsg = input.parentElement.querySelector('.error-msg');
      
      if (!field.validator(input.value)) {
        isValid = false;
        input.classList.add('is-invalid');
        if (errorMsg) errorMsg.classList.remove('hidden');
      } else {
        input.classList.remove('is-invalid');
        if (errorMsg) errorMsg.classList.add('hidden');
      }
    });

    if (isValid) {
      // Simulate luxury submission animation
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <i class="fa-solid fa-circle-notch fa-spin"></i>
        <span>Reviewing & Encrypting...</span>
      `;

      setTimeout(() => {
        form.classList.add('hidden');
        if (successState) successState.classList.remove('hidden');
        triggerGoldAudioChime();
      }, 1000);
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <span>Share My Story</span>
        <i class="fa-solid fa-arrow-right text-xs group-hover:translate-x-1.5 transition-transform"></i>
      `;
      if (successState) successState.classList.add('hidden');
      form.classList.remove('hidden');
    });
  }
}

/* ==========================================================================
   9. HEADER SCROLL STATE & MOBILE MENU
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const links = document.querySelectorAll('.mobile-link');

  if (!menuBtn || !menu) return;

  menuBtn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
    });
  });
}

/* ==========================================================================
   10. WEB AUDIO API LUXURY ACOUSTIC RESONANCE
   ========================================================================== */
let audioCtx = null;
let isAudioEnabled = false;

function initAudioExperience() {
  const toggleBtn = document.getElementById('soundtrack-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    isAudioEnabled = !isAudioEnabled;
    const soundText = toggleBtn.querySelector('.sound-text');
    const soundIcon = toggleBtn.querySelector('.sound-icon');

    if (isAudioEnabled) {
      if (soundText) soundText.textContent = 'AUDIO ON';
      if (soundIcon) soundIcon.className = 'fa-solid fa-volume-high text-xs sound-icon text-gold';
      triggerGoldAudioChime();
    } else {
      if (soundText) soundText.textContent = 'AUDIO MUTED';
      if (soundIcon) soundIcon.className = 'fa-solid fa-volume-xmark text-xs sound-icon text-gray-500';
    }
  });
}

function triggerGoldAudioChime() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    // Harmonic golden chord note ~ 528 Hz (Love / transformation / clarity)
    osc.frequency.setValueAtTime(528, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1056, audioCtx.currentTime + 0.6);

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.2);
  } catch (e) {
    // Graceful fallback if autoplay policies block sound
  }
}
