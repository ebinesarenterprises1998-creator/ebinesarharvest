import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HeroAgricultural3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check user preference for reduced motion or mobile width
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 520;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x132a19, 0.0018);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 5, 28);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    container.appendChild(renderer.domElement);

    // Subtle Ambient & Sun Horizon Lighting
    const ambientLight = new THREE.AmbientLight(0xd4af37, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff4d6, 1.4);
    sunLight.position.set(10, 20, 15);
    scene.add(sunLight);

    const greenFill = new THREE.PointLight(0x4ade80, 0.8, 40);
    greenFill.position.set(-15, 10, -5);
    scene.add(greenFill);

    // Floating Golden & Leaf Nature Particles
    const particleCount = isMobile ? 60 : 160;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const goldColor = new THREE.Color(0xd4af37);
    const leafColor = new THREE.Color(0x52b788);
    const creamColor = new THREE.Color(0xfefae0);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 50;
      positions[i3 + 1] = Math.random() * 25 - 5;
      positions[i3 + 2] = (Math.random() - 0.5) * 40;

      // Color variation
      const mixFactor = Math.random();
      const pColor = mixFactor > 0.6 ? goldColor : mixFactor > 0.3 ? leafColor : creamColor;
      colors[i3] = pColor.r;
      colors[i3 + 1] = pColor.g;
      colors[i3 + 2] = pColor.b;

      scales[i] = Math.random() * 2 + 1;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom circular soft particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.5, 'rgba(255,255,255,0.6)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.6 : 0.8,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Wheat Field Sway Stalks (Instanced Geometry)
    const stalkCount = isMobile ? 30 : 70;
    const wheatGroup = new THREE.Group();
    const wheatMat = new THREE.MeshStandardMaterial({
      color: 0xcca43b,
      roughness: 0.6,
      metalness: 0.1,
    });

    const stalks: { mesh: THREE.Mesh; baseRot: number; speed: number }[] = [];

    for (let i = 0; i < stalkCount; i++) {
      const heightStalk = Math.random() * 3 + 4;
      const geom = new THREE.CylinderGeometry(0.04, 0.08, heightStalk, 5);
      geom.translate(0, heightStalk / 2, 0); // origin at base
      const mesh = new THREE.Mesh(geom, wheatMat);

      mesh.position.set(
        (Math.random() - 0.5) * 45,
        -7,
        (Math.random() - 0.5) * 20 - 5
      );

      const baseRot = (Math.random() - 0.5) * 0.2;
      mesh.rotation.z = baseRot;
      mesh.rotation.y = Math.random() * Math.PI;

      // Add wheat grain head
      const headGeom = new THREE.ConeGeometry(0.18, 1.2, 5);
      headGeom.translate(0, heightStalk + 0.6, 0);
      const headMesh = new THREE.Mesh(headGeom, wheatMat);
      mesh.add(headMesh);

      wheatGroup.add(mesh);
      stalks.push({ mesh, baseRot, speed: Math.random() * 0.015 + 0.01 });
    }
    scene.add(wheatGroup);

    // Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax
      targetX += (mouseX * 2 - targetX) * 0.03;
      targetY += (-mouseY * 1.5 - targetY) * 0.03;
      camera.position.x = targetX;
      camera.position.y = 5 + targetY;
      camera.lookAt(0, 4, 0);

      // Sway wheat stalks gently like a faith breeze
      if (!prefersReducedMotion) {
        stalks.forEach((stalk, idx) => {
          const sway = Math.sin(elapsedTime * 1.8 + idx * 0.4) * 0.08;
          stalk.mesh.rotation.z = stalk.baseRot + sway;
        });

        // Floating particles upward drift
        const posAttr = particleGeometry.attributes.position as THREE.BufferAttribute;
        const posArr = posAttr.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          posArr[i3 + 1] += 0.03; // rise
          posArr[i3] += Math.sin(elapsedTime + i) * 0.01; // sway

          // Reset when particle reaches top
          if (posArr[i3 + 1] > 20) {
            posArr[i3 + 1] = -5;
          }
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      wheatMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      id="hero-3d-agricultural-canvas"
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-85"
      aria-hidden="true"
    />
  );
};
