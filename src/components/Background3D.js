"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./Background3D.module.css";

export default function Background3D() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 12;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Mouse tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const onMouseMove = (e) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", onMouseMove);

    // Shapes
    const group = new THREE.Group();
    scene.add(group);

    const shapes = [];
    const colors = [
      0x4a6cf7, // blue
      0x6c5ce7, // purple
      0xa29bfe, // light purple
      0x00cec9, // teal
      0xfd79a8, // pink
    ];

    const geometries = [
      new THREE.TorusKnotGeometry(0.6, 0.2, 64, 8),
      new THREE.IcosahedronGeometry(0.5, 0),
      new THREE.OctahedronGeometry(0.5, 0),
      new THREE.TorusGeometry(0.5, 0.15, 16, 32),
    ];

    for (let i = 0; i < shapeCount; i++) {
      const geo = geometries[i % geometries.length];
      const color = colors[i % colors.length];
      const mat = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true,
        transparent: true,
        opacity: 0.15 + Math.random() * 0.15,
      });

      const mesh = new THREE.Mesh(geo, mat);

      // Random positions in a sphere
      const radius = 6 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      mesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
      mesh.position.y = radius * Math.sin(phi) * Math.sin(theta);
      mesh.position.z = radius * Math.cos(phi);

      mesh.rotation.x = Math.random() * Math.PI * 2;
      mesh.rotation.y = Math.random() * Math.PI * 2;

      mesh.userData = {
        speed: 0.002 + Math.random() * 0.004,
        rotSpeedX: (Math.random() - 0.5) * 0.01,
        rotSpeedY: (Math.random() - 0.5) * 0.01,
        rotSpeedZ: (Math.random() - 0.5) * 0.01,
        floatSpeed: 0.001 + Math.random() * 0.003,
        floatAmp: 0.3 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        initialPos: mesh.position.clone(),
        scale: 0.5 + Math.random() * 1,
      };

      mesh.scale.set(
        mesh.userData.scale,
        mesh.userData.scale,
        mesh.userData.scale
      );

      group.add(mesh);
      shapes.push(mesh);
    }

    // Reduce complexity on mobile
    const isMobile = window.innerWidth < 768;
    const shapeCount = isMobile ? 10 : 20;
    const dotCount = isMobile ? 300 : 800;

    // Small dots (stars)
    const dotsGeometry = new THREE.BufferGeometry();
    const dotsCount = dotCount;
    const positions = new Float32Array(dotsCount * 3);
    const dotColors = new Float32Array(dotsCount * 3);

    for (let i = 0; i < dotsCount; i++) {
      const r = 15 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const brightness = 0.3 + Math.random() * 0.5;
      dotColors[i * 3] = brightness;
      dotColors[i * 3 + 1] = brightness;
      dotColors[i * 3 + 2] = brightness + Math.random() * 0.2;
    }

    dotsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    dotsGeometry.setAttribute("color", new THREE.BufferAttribute(dotColors, 3));

    const dotsMaterial = new THREE.PointsMaterial({
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      vertexColors: true,
      sizeAttenuation: true,
    });

    const dots = new THREE.Points(dotsGeometry, dotsMaterial);
    group.add(dots);

    // Faint connecting lines
    const linePositions = [];
    for (let i = 0; i < 30; i++) {
      const idx1 = Math.floor(Math.random() * shapes.length);
      const idx2 = Math.floor(Math.random() * shapes.length);
      if (idx1 !== idx2) {
        const p1 = shapes[idx1].position;
        const p2 = shapes[idx2].position;
        linePositions.push(p1.x, p1.y, p1.z);
        linePositions.push(p2.x, p2.y, p2.z);
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePositions, 3)
    );
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x4a6cf7,
      transparent: true,
      opacity: 0.03,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    group.add(lines);

    // Animation
    let time = 0;
    let rafId = null;

    function animate() {
      rafId = requestAnimationFrame(animate);
      time += 0.01;

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Rotate entire group slowly
      group.rotation.y += 0.001;
      group.rotation.x += 0.0003;

      // Mouse parallax on group
      group.rotation.x += mouse.y * 0.002;
      group.rotation.y += mouse.x * 0.002;

      // Animate individual shapes
      shapes.forEach((mesh) => {
        const ud = mesh.userData;
        mesh.rotation.x += ud.rotSpeedX;
        mesh.rotation.y += ud.rotSpeedY;
        mesh.rotation.z += ud.rotSpeedZ;

        // Floating motion (oscillate around initial position, no drift)
        mesh.position.y = ud.initialPos.y + Math.sin(time * ud.floatSpeed * 10 + ud.phase) * ud.floatAmp;
      });

      // Animate dots
      dots.rotation.y += 0.0002;
      dots.rotation.x += 0.0001;

      // Camera position based on mouse
      camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.02;
      camera.position.y += (-mouse.y * 1.5 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("resize", onResize);

    // Cleanup
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      // Dispose geometries and materials
      shapes.forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
      dotsGeometry.dispose();
      dotsMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
    };
  }, []);

  return <div ref={containerRef} className={styles.background} />;
}
