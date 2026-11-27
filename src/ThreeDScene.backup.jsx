
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

function createLilyPadGeometry() {
  const shape = new THREE.Shape();
  const radius = 0.48;
  const gap = 0.34;

  for (let i = 0; i <= 48; i++) {
    const angle = gap + (Math.PI * 2 - gap * 2) * (i / 48);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }

  shape.lineTo(0, 0);
  shape.closePath();

  return new THREE.ShapeGeometry(shape, 32);
}

function createGlassMaterial(color, options = {}) {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.08,
    roughness: 0.14,
    transmission: 0.82,
    thickness: 1.1,
    ior: 1.45,
    transparent: true,
    opacity: 0.88,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    iridescence: 0.7,
    iridescenceIOR: 1.3,
    side: THREE.DoubleSide,
    ...options,
  });
}

function ThreeDScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDisposed = false;
    let animationId;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.appendChild(renderer.domElement);

    // REFLECTION ENVIRONMENT FOR GLASS
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnvironment = new RoomEnvironment();
    const environmentMap = pmremGenerator.fromScene(roomEnvironment);

    scene.environment = environmentMap.texture;

    roomEnvironment.dispose();
    pmremGenerator.dispose();

    // SOFT GARDEN LIGHTING
    scene.add(new THREE.AmbientLight(0xe6fff5, 1.7));

    const sunlight = new THREE.DirectionalLight(0xfff3dc, 3.2);
    sunlight.position.set(-3, 6, 5);
    scene.add(sunlight);

    const lavenderLight = new THREE.PointLight(0xc4a9ff, 22, 18);
    lavenderLight.position.set(-3, 1.5, 3);
    scene.add(lavenderLight);

    const pinkLight = new THREE.PointLight(0xf5c4dc, 18, 16);
    pinkLight.position.set(3, -1, 2);
    scene.add(pinkLight);

    const aquaLight = new THREE.PointLight(0xa8e5d8, 24, 18);
    aquaLight.position.set(0, -2, -2);
    scene.add(aquaLight);

    // BACKGROUND GARDEN GLOW
    const glowGroup = new THREE.Group();
    scene.add(glowGroup);

    const glowColors = [0xc4e9dc, 0xd8c9f3, 0xf4d7e5];

    for (let i = 0; i < 9; i++) {
      const glow = new THREE.Mesh(
        new THREE.CircleGeometry(0.45 + Math.random() * 0.7, 32),
        new THREE.MeshBasicMaterial({
          color: glowColors[i % glowColors.length],
          transparent: true,
          opacity: 0.045,
          depthWrite: false,
        })
      );

      glow.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 7,
        -2.5 - Math.random() * 2
      );

      glowGroup.add(glow);
    }

    // FLOATING LILY PADS
    const lilyGroup = new THREE.Group();
    scene.add(lilyGroup);

    const lilyData = [];
    const lilyGeometry = createLilyPadGeometry();

    const lilyColors = [0x9fc9b7, 0xb7d9c8, 0x8ebcaf, 0xc3dfd0];

    for (let i = 0; i < 9; i++) {
      const material = createGlassMaterial(
        lilyColors[i % lilyColors.length],
        {
          transmission: 0.35,
          opacity: 0.76,
          roughness: 0.28,
          thickness: 0.35,
          iridescence: 0.25,
        }
      );

      const pad = new THREE.Mesh(lilyGeometry, material);

      const scale = 0.55 + Math.random() * 0.65;

      pad.scale.set(scale, scale, scale);
      pad.position.set(
        (Math.random() - 0.5) * 9,
        (Math.random() - 0.5) * 5.8,
        -0.8 - Math.random() * 1.5
      );

      pad.rotation.z = Math.random() * Math.PI * 2;
      lilyGroup.add(pad);

      lilyData.push({
        mesh: pad,
        baseY: pad.position.y,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.3,
      });
    }

    // TINY FLOATING FLOWERS
    const flowerGroup = new THREE.Group();
    scene.add(flowerGroup);

    const flowerData = [];

    for (let i = 0; i < 7; i++) {
      const flower = new THREE.Group();
      const petalMaterial = createGlassMaterial(0xf2d7e7, {
        transmission: 0.65,
        opacity: 0.85,
        roughness: 0.12,
      });

      for (let p = 0; p < 5; p++) {
        const angle = (p / 5) * Math.PI * 2;
        const petal = new THREE.Mesh(
          new THREE.SphereGeometry(0.11, 16, 16),
          petalMaterial
        );

        petal.scale.set(0.75, 1.5, 0.35);
        petal.position.set(
          Math.cos(angle) * 0.13,
          Math.sin(angle) * 0.13,
          0
        );
        petal.rotation.z = angle;
        flower.add(petal);
      }

      const center = new THREE.Mesh(
        new THREE.SphereGeometry(0.065, 16, 16),
        createGlassMaterial(0xffedc5, {
          transmission: 0.4,
          opacity: 0.9,
        })
      );

      flower.add(center);

      flower.position.set(
        (Math.random() - 0.5) * 9,
        (Math.random() - 0.5) * 5.5,
        -0.2 - Math.random() * 1.5
      );

      const scale = 0.55 + Math.random() * 0.65;
      flower.scale.setScalar(scale);
      flowerGroup.add(flower);

      flowerData.push({
        mesh: flower,
        baseY: flower.position.y,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // EXPANDING WATER RIPPLE RINGS
    const rippleGroup = new THREE.Group();
    scene.add(rippleGroup);

    const rippleData = [];

    for (let i = 0; i < 5; i++) {
      const ripple = new THREE.Mesh(
        new THREE.RingGeometry(0.65, 0.67, 80),
        new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? 0xd9f5e9 : 0xe9d9f1,
          transparent: true,
          opacity: 0.22,
          side: THREE.DoubleSide,
          depthWrite: false,
        })
      );

      ripple.position.set(
        (Math.random() - 0.5) * 4,
        -1.35 + Math.random() * 2.7,
        -0.5
      );

      rippleGroup.add(ripple);

      rippleData.push({
        mesh: ripple,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // GLASS WATER DROPLETS
    const dropletGroup = new THREE.Group();
    scene.add(dropletGroup);

    const dropletData = [];

    for (let i = 0; i < 16; i++) {
      const radius = 0.045 + Math.random() * 0.085;

      const droplet = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 24, 24),
        createGlassMaterial(0xdaf4ed, {
          transmission: 0.95,
          opacity: 0.8,
          thickness: 1.4,
          roughness: 0.04,
        })
      );

      droplet.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        Math.random() * 2
      );

      dropletGroup.add(droplet);

      dropletData.push({
        mesh: droplet,
        baseY: droplet.position.y,
        phase: Math.random() * Math.PI * 2,
        speed: 0.35 + Math.random() * 0.5,
      });
    }

    // SOFT FLOATING PARTICLES
    const particleCount = 450;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleData = [];

    const particlePalette = [
      new THREE.Color("#d9f3e8"),
      new THREE.Color("#e5d8f6"),
      new THREE.Color("#f5d9e7"),
      new THREE.Color("#fff4d9"),
      new THREE.Color("#b8e1dc"),
    ];

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 12;
      const y = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 5;

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      const color =
        particlePalette[Math.floor(Math.random() * particlePalette.length)];

      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;

      particleData.push({
        x,
        y,
        z,
        speed: 0.2 + Math.random() * 0.55,
        phase: Math.random() * Math.PI * 2,
        amplitude: 0.15 + Math.random() * 0.3,
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

    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        size: 0.035,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );

    scene.add(particles);

    // EXISTING LOTUS MODEL
    const loader = new GLTFLoader();
    let modelGroup = null;

    loader.load(
      "/models/my-model.glb",
      (gltf) => {
        if (isDisposed) return;

        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        model.position.set(-center.x, -center.y, -center.z);

        const maxDimension = Math.max(size.x, size.y, size.z);

        if (maxDimension > 0) {
          model.scale.setScalar(2.1 / maxDimension);
        }

        // GIVE THE MODEL A GLASS-LIKE FINISH
        model.traverse((child) => {
          if (!child.isMesh) return;

          const originalMaterials = Array.isArray(child.material)
            ? child.material
            : [child.material];

          const glassMaterials = originalMaterials.map((original) => {
            
const material = new THREE.MeshPhysicalMaterial({
  map: original.map || null,
  normalMap: original.normalMap || null,
  roughnessMap: original.roughnessMap || null,
  metalnessMap: original.metalnessMap || null,
  aoMap: original.aoMap || null,
  emissiveMap: original.emissiveMap || null,
  alphaMap: original.alphaMap || null,

  color: original.color
    ? original.color.clone().lerp(new THREE.Color("#e8c7ef"), 0.55)
    : new THREE.Color("#e8c7ef"),

  metalness: 0.12,
  roughness: 0.1,
  transmission: 0.7,
  thickness: 1.2,
  ior: 1.48,

  clearcoat: 1,
  clearcoatRoughness: 0.04,

  iridescence: 1,
  iridescenceIOR: 1.35,
  iridescenceThicknessRange: [180, 600],

  side: original.side,
  vertexColors: original.vertexColors,
});


            if (original.emissive) {
              material.emissive.copy(original.emissive);
              material.emissiveIntensity = 0.12;
            }

            if (original.map) {
              material.color.multiplyScalar(0.95);
            }

            return material;
          });

          child.material = Array.isArray(child.material)
            ? glassMaterials
            : glassMaterials[0];

          child.castShadow = true;
          child.receiveShadow = true;
        });

        modelGroup = new THREE.Group();
        modelGroup.add(model);
        scene.add(modelGroup);
      },
      undefined,
      (error) => {
        console.error("LOTUS MODEL FAILED TO LOAD:", error);
      }
    );

    // POINTER INTERACTION
    let mouseX = 0;
    let mouseY = 0;
    let drag = false;
    let previousX = 0;
    let previousY = 0;

    const onPointerMove = (event) => {
      const rect = container.getBoundingClientRect();

      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      if (drag && modelGroup) {
        modelGroup.rotation.y += (event.clientX - previousX) * 0.008;
        modelGroup.rotation.x += (event.clientY - previousY) * 0.008;
      }

      previousX = event.clientX;
      previousY = event.clientY;
    };

    const onPointerDown = (event) => {
      drag = true;
      previousX = event.clientX;
      previousY = event.clientY;
    };

    const onPointerUp = () => {
      drag = false;
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    // RESPONSIVE SIZE
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

    const animate = () => {
      if (isDisposed) return;

      animationId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      lilyData.forEach(({ mesh, baseY, phase, speed }) => {
        mesh.position.y =
          baseY + Math.sin(time * speed + phase) * 0.1;
        mesh.rotation.z += 0.0007;
      });

      flowerData.forEach(({ mesh, baseY, phase }) => {
        mesh.position.y =
          baseY + Math.sin(time * 0.65 + phase) * 0.13;
        mesh.rotation.z = Math.sin(time * 0.35 + phase) * 0.12;
      });

      dropletData.forEach(({ mesh, baseY, phase, speed }) => {
        mesh.position.y =
          baseY + Math.sin(time * speed + phase) * 0.22;
        mesh.position.x += Math.sin(time * 0.2 + phase) * 0.0008;
        mesh.rotation.y += 0.004;
      });

      rippleData.forEach(({ mesh, phase }) => {
        const scale = 0.8 + ((time * 0.12 + phase) % 1.4);

        mesh.scale.setScalar(scale);
        mesh.material.opacity =
          0.16 * (1 - ((time * 0.12 + phase) % 1.4) / 1.4);
      });

      const positions = particleGeometry.attributes.position.array;

      for (let i = 0; i < particleCount; i++) {
        const data = particleData[i];

        positions[i * 3] =
          data.x + Math.sin(time * data.speed + data.phase) * 0.12;

        positions[i * 3 + 1] =
          data.y +
          Math.sin(time * data.speed + data.phase) * data.amplitude;

        positions[i * 3 + 2] =
          data.z + Math.cos(time * data.speed + data.phase) * 0.1;
      }

      particleGeometry.attributes.position.needsUpdate = true;

      if (modelGroup) {
        modelGroup.position.y = Math.sin(time * 0.85) * 0.13;

        if (!drag) {
          modelGroup.rotation.y += 0.0018;
          modelGroup.rotation.x +=
            (mouseY * 0.12 - modelGroup.rotation.x) * 0.012;
        }
      }

      lavenderLight.position.x = -3 + mouseX * 1.5;
      lavenderLight.position.y = 1.5 + mouseY * 1.2;

      pinkLight.intensity = 16 + Math.sin(time * 0.8) * 3;
      aquaLight.intensity = 22 + Math.sin(time * 0.6) * 3;

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();

      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);

      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();

        if (object.material) {
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

          materials.forEach((material) => material.dispose());
        }
      });

      environmentMap.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="three-scene" ref={containerRef} />;
}

export default ThreeDScene;
