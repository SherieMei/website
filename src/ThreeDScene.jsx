
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

function ThreeDScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;

    container.appendChild(renderer.domElement);

    // LIGHTS
    scene.add(new THREE.AmbientLight(0xffffff, 2.5));

    const light = new THREE.DirectionalLight(0xffffff, 4);
    light.position.set(5, 5, 5);
    scene.add(light);

    const purpleLight = new THREE.PointLight(0x9b7cff, 30, 50);
    purpleLight.position.set(-4, 3, 4);
    scene.add(purpleLight);

    const blueLight = new THREE.PointLight(0x74cfff, 20, 50);
    blueLight.position.set(4, -2, 3);
    scene.add(blueLight);

    // PARTICLE UNIVERSE
    const particleCount = 350;

    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const pastelColors = [
      new THREE.Color("#d9c7ff"),
      new THREE.Color("#ffc9e5"),
      new THREE.Color("#b8eaff"),
      new THREE.Color("#ffffff"),
      new THREE.Color("#c6f3d5"),
    ];

    const particleData = [];

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 12;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 8;

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      const color =
        pastelColors[Math.floor(Math.random() * pastelColors.length)];

      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;

      particleData.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        speed: 0.3 + Math.random() * 0.8,
        amplitude: 0.15 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
      });
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    particleGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(particleColors, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(
      particleGeometry,
      particleMaterial
    );

    scene.add(particles);
    // FLOATING GLASS SPHERES

const bubbleGroup = new THREE.Group();
scene.add(bubbleGroup);

const bubbleColors = [
  0xd9c7ff,
  0xffc9e5,
  0xb8eaff,
  0xc6f3d5,
];

const bubbleData = [];

for (let i = 0; i < 18; i++) {
  const radius = 0.08 + Math.random() * 0.22;

  const geometry = new THREE.SphereGeometry(radius, 32, 32);

  const material = new THREE.MeshPhysicalMaterial({
    color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
    metalness: 0.05,
    roughness: 0.08,
    transmission: 0.95,
    thickness: 0.8,
    ior: 1.5,
    transparent: true,
    opacity: 0.8,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
  });

  const bubble = new THREE.Mesh(geometry, material);

  bubble.position.set(
    (Math.random() - 0.5) * 8,
    (Math.random() - 0.5) * 6,
    (Math.random() - 0.5) * 5
  );

  bubbleGroup.add(bubble);

  bubbleData.push({
    mesh: bubble,
    originalY: bubble.position.y,
    speed: 0.3 + Math.random() * 0.6,
    phase: Math.random() * Math.PI * 2,
  });
}

    // MODEL
    const loader = new GLTFLoader();

    let model = null;
    let modelGroup = null;

    loader.load(
      "/models/my-model.glb",
      (gltf) => {
        model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        model.position.set(-center.x, -center.y, -center.z);

        const maxDimension = Math.max(size.x, size.y, size.z);

        if (maxDimension > 0) {
          model.scale.setScalar(2.7 / maxDimension);
        }

        modelGroup = new THREE.Group();
        modelGroup.add(model);
        scene.add(modelGroup);

        camera.position.set(0, 0, 6.5);
        camera.lookAt(0, 0, 0);

        console.log("3D MODEL LOADED:", gltf);
        console.log("MODEL SIZE:", size);
      },
      (progress) => {
        console.log(
          "Loading model:",
          (progress.loaded / progress.total) * 100,
          "%"
        );
      },
      (error) => {
        console.error("MODEL FAILED TO LOAD:", error);
      }
    );

    // MOUSE
    let mouseX = 0;
    let mouseY = 0;

    let drag = false;
    let previousX = 0;
    let previousY = 0;

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();

      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (drag && modelGroup) {
        modelGroup.rotation.y += (e.clientX - previousX) * 0.01;
        modelGroup.rotation.x += (e.clientY - previousY) * 0.01;

        previousX = e.clientX;
        previousY = e.clientY;
      }
    };

    const onPointerDown = (e) => {
      drag = true;
      previousX = e.clientX;
      previousY = e.clientY;
    };

    const onPointerUp = () => {
      drag = false;
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    // RESIZE
    const resizeObserver = new ResizeObserver(() => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });

    resizeObserver.observe(container);

    // ANIMATION
    const clock = new THREE.Clock();
    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();
      // BUBBLE FLOATING ANIMATION

bubbleData.forEach((bubble) => {
  bubble.mesh.position.y =
    bubble.originalY +
    Math.sin(time * bubble.speed + bubble.phase) * 0.35;

  bubble.mesh.rotation.x += 0.002;
  bubble.mesh.rotation.y += 0.003;
});

      // PARTICLE MOVEMENT
      const positions = particleGeometry.attributes.position.array;

      for (let i = 0; i < particleCount; i++) {
        const data = particleData[i];

        positions[i * 3] =
          data.baseX + Math.sin(time * data.speed + data.phase) * 0.15;

        positions[i * 3 + 1] =
          data.baseY +
          Math.sin(time * data.speed + data.phase) * data.amplitude;

        positions[i * 3 + 2] =
          data.baseZ + Math.cos(time * data.speed + data.phase) * 0.15;
      }

      particleGeometry.attributes.position.needsUpdate = true;

      // LOTUS ANIMATION
      if (modelGroup) {
        modelGroup.position.y = Math.sin(time * 1.2) * 0.15;

        if (!drag) {
          modelGroup.rotation.y += 0.003;
        }

        modelGroup.rotation.x +=
          (mouseY * 0.25 - modelGroup.rotation.x) * 0.02;
      }

      // LIGHT FOLLOWING MOUSE
      purpleLight.position.x = mouseX * 4;
      purpleLight.position.y = mouseY * 4;

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();

      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();

        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="three-scene" ref={containerRef} />;
}

export default ThreeDScene;
