
import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ==========================================
   SHE — THE HIDDEN ALPINE GARDEN
   Procedural mountain lake environment
========================================== */

function seededRandom(seed) {
  let value = seed;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function smoothNoise(x, seed = 1) {
  return (
    Math.sin(x * 0.075 + seed) * 0.55 +
    Math.sin(x * 0.17 + seed * 2.1) * 0.23 +
    Math.sin(x * 0.31 - seed * 1.4) * 0.12 +
    Math.sin(x * 0.61 + seed * 0.7) * 0.055
  );
}

/* ==========================================
   MOUNTAIN GENERATOR
   Layered, irregular alpine terrain
========================================== */

function createMountainLayer(scene, options = {}) {
  const {
    z = -35,
    ridgeBase = 14,
    peakHeight = 9,
    base = -4,
    width = 115,
    depth = 15,
    color = 0x849b91,
    seed = 1,
    opacity = 1,
  } = options;

  const columns = 260;
  const rows = 42;

  const vertices = [];
  const colors = [];
  const indices = [];

  const baseColor = new THREE.Color(color);

  const peaks = [
    { x: -52, width: 10, height: 0.65 },
    { x: -41, width: 6, height: 1.05 },
    { x: -28, width: 12, height: 0.7 },
    { x: -15, width: 7, height: 1.2 },
    { x: -2, width: 11, height: 0.65 },
    { x: 12, width: 7, height: 1.1 },
    { x: 25, width: 12, height: 0.8 },
    { x: 39, width: 7, height: 1.15 },
    { x: 52, width: 10, height: 0.65 },
  ];

  for (let row = 0; row <= rows; row++) {
    const t = row / rows;

    for (let column = 0; column <= columns; column++) {
      const x = (column / columns - 0.5) * width;

      let peakShape = 0;

      for (const peak of peaks) {
        const distance = (x - peak.x) / peak.width;
        peakShape +=
          peak.height * Math.exp(-distance * distance * 0.5);
      }

      const ridgeVariation = smoothNoise(x, seed);

      const ridgeY =
        ridgeBase +
        peakHeight * (0.35 + peakShape) +
        ridgeVariation * 2.2;

      const ruggedness =
        Math.sin(x * 0.82 + row * 0.31 + seed) * 0.2 +
        Math.sin(x * 1.65 - row * 0.48 + seed) * 0.075 +
        Math.cos(x * 0.36 + row * 0.75) * 0.12;

      const y =
        THREE.MathUtils.lerp(ridgeY, base, t) +
        ruggedness * (1 - t * 0.45);

      const terrainZ = z + t * depth;

      vertices.push(x, y, terrainZ);

      const distanceShade = 1 - t * 0.13;
      const naturalVariation =
        0.94 +
        Math.sin(x * 0.14 + row * 0.27 + seed) * 0.035 +
        Math.cos(x * 0.07 - row * 0.4) * 0.025;

      const vertexColor = baseColor
        .clone()
        .multiplyScalar(distanceShade * naturalVariation);

      colors.push(
        vertexColor.r,
        vertexColor.g,
        vertexColor.b
      );
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const a = row * (columns + 1) + column;
      const b = a + 1;
      const c = a + columns + 1;
      const d = c + 1;

      indices.push(a, c, b, b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );

  geometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3)
  );

  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 1,
    metalness: 0,
    side: THREE.DoubleSide,
    flatShading: true,
    transparent: opacity < 1,
    opacity,
  });

  const mountain = new THREE.Mesh(geometry, material);

  mountain.frustumCulled = false;
  scene.add(mountain);

  return mountain;
}

/* ==========================================
   FOREST
   Irregular evergreen tree clusters
========================================== */

function createForest(scene) {
  const group = new THREE.Group();
  const random = seededRandom(4821);

  const trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x554e42,
    roughness: 1,
  });

  const foliageColors = [
    0x344f43,
    0x405e4c,
    0x4c6c56,
    0x587761,
    0x66816a,
    0x718c76,
  ];

  const foliageMaterials = foliageColors.map(
    (color) =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 1,
        flatShading: true,
      })
  );

  const foliageGeometry = new THREE.IcosahedronGeometry(1, 1);

  const treeCount = 230;

  for (let i = 0; i < treeCount; i++) {
    const tree = new THREE.Group();

    const height = 1.1 + random() * 3.3;
    const width = 0.38 + random() * 0.55;

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.025,
        0.07,
        height * 0.48,
        5
      ),
      trunkMaterial
    );

    trunk.position.y = height * 0.23;
    tree.add(trunk);

    const foliageMaterial =
      foliageMaterials[
        Math.floor(random() * foliageMaterials.length)
      ];

    // Organic, overlapping foliage clusters.
    const clusterCount = 3 + Math.floor(random() * 3);

    for (let j = 0; j < clusterCount; j++) {
      const cluster = new THREE.Mesh(
        foliageGeometry,
        foliageMaterial
      );

      const size = width * (0.9 - j * 0.09);

      cluster.scale.set(
        size * (0.8 + random() * 0.35),
        height * (0.16 + random() * 0.045),
        size * (0.8 + random() * 0.35)
      );

      cluster.position.set(
        (random() - 0.5) * width * 0.3,
        height * (0.42 + j * 0.13),
        (random() - 0.5) * width * 0.3
      );

      tree.add(cluster);
    }

    const side = random() > 0.5 ? 1 : -1;

    tree.position.set(
      side * (12 + random() * 37),
      -0.5 + random() * 0.2,
      -14 - random() * 11
    );

    tree.rotation.y = random() * Math.PI * 2;
    tree.scale.setScalar(0.75 + random() * 0.9);

    group.add(tree);
  }

  scene.add(group);

  return group;
}

/* ==========================================
   SHORELINE DETAILS
========================================== */

function createShoreline(scene) {
  const group = new THREE.Group();
  const random = seededRandom(721);

  const stoneColors = [
    0x849b8e,
    0x9aab9c,
    0x71887b,
    0xb1b9a8,
  ];

  for (let i = 0; i < 70; i++) {
    const material = new THREE.MeshStandardMaterial({
      color: stoneColors[Math.floor(random() * stoneColors.length)],
      roughness: 1,
      flatShading: true,
    });

    const stone = new THREE.Mesh(
      new THREE.DodecahedronGeometry(1, 0),
      material
    );

    const side = random() > 0.5 ? 1 : -1;
    const size = 0.12 + random() * 0.38;

    stone.scale.set(
      size * 1.6,
      size * 0.65,
      size
    );

    stone.position.set(
      side * (10 + random() * 31),
      -0.42 + random() * 0.12,
      -8 - random() * 13
    );

    stone.rotation.set(
      random() * 0.5,
      random() * Math.PI,
      random() * 0.3
    );

    group.add(stone);
  }

  scene.add(group);

  return group;
}

/* ==========================================
   VALLEY MIST
   Slowly moving atmospheric layers
========================================== */

function createMist(scene) {
  const group = new THREE.Group();

  for (let i = 0; i < 7; i++) {
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0.075 + (i % 3) * 0.025 },
        uPhase: { value: i * 1.7 },
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position =
            projectionMatrix *
            modelViewMatrix *
            vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uOpacity;
        uniform float uPhase;

        varying vec2 vUv;

        void main() {
          float horizontal =
            smoothstep(0.0, 0.18, vUv.x) *
            (1.0 - smoothstep(0.78, 1.0, vUv.x));

          float vertical =
            sin(vUv.y * 3.14159);

          float waves =
            0.78 +
            0.22 * sin(vUv.x * 7.0 + uTime * 0.12 + uPhase);

          float softness =
            smoothstep(0.0, 0.35, vUv.y) *
            (1.0 - smoothstep(0.65, 1.0, vUv.y));

          float alpha =
            horizontal *
            vertical *
            softness *
            waves *
            uOpacity;

          gl_FragColor =
            vec4(0.88, 0.93, 0.88, alpha);
        }
      `,
    });

    const mist = new THREE.Mesh(
      new THREE.PlaneGeometry(48, 4.2, 1, 1),
      material
    );

    mist.position.set(
      (i % 3 - 1) * 1.8,
      0.2 + (i % 4) * 0.55,
      -12 - i * 3.2
    );

    group.add(mist);
  }

  scene.add(group);

  return group;
}

/* ==========================================
   WATER
   Reflective turquoise and sage lake
========================================== */

function createWaterMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uClick: { value: new THREE.Vector2(9999, 9999) },
      uClickTime: { value: -1000 },
    },

    vertexShader: `
      uniform float uTime;
      uniform vec2 uClick;
      uniform float uClickTime;

      varying vec2 vUv;
      varying float vDepression;
      varying float vClickDistance;

      void main() {
        vUv = uv;

        vec3 p = position;

        float longWave =
          sin(p.x * 0.28 + uTime * 0.22) * 0.012;

        float crossWave =
          sin(p.y * 0.34 - uTime * 0.18) * 0.009;

        float fineWave =
          sin((p.x + p.y) * 0.5 + uTime * 0.28) * 0.004;

        float height =
          longWave + crossWave + fineWave;

        float age = uTime - uClickTime;

        float distanceFromClick =
          distance(p.xy, uClick);

        float depression =
          -0.13 *
          exp(-distanceFromClick * distanceFromClick * 2.8) *
          exp(-max(age, 0.0) * 3.2);

        float ring =
          sin(distanceFromClick * 10.0 - age * 9.0) *
          exp(-pow(
            (distanceFromClick - max(age, 0.0) * 0.72) * 1.7,
            2.0
          )) *
          exp(-max(age, 0.0) * 0.85);

        if (age < 0.0 || age > 3.5) {
          ring = 0.0;
        }

        height += depression + ring * 0.045;

        p.z += height;

        vDepression = depression;
        vClickDistance = distanceFromClick;

        gl_Position =
          projectionMatrix *
          modelViewMatrix *
          vec4(p, 1.0);
      }
    `,

    fragmentShader: `
      uniform float uTime;
      uniform float uClickTime;

      varying vec2 vUv;
      varying float vDepression;
      varying float vClickDistance;

      void main() {
        vec3 deepWater = vec3(0.20, 0.38, 0.39);
        vec3 aquaWater = vec3(0.40, 0.62, 0.59);
        vec3 sageWater = vec3(0.57, 0.69, 0.61);

        float depth = smoothstep(0.0, 0.95, vUv.y);

        vec3 color = mix(deepWater, aquaWater, depth);

        color = mix(
          color,
          sageWater,
          smoothstep(0.35, 1.0, vUv.y) * 0.35
        );

        float rippleA =
          sin(vUv.y * 230.0 + vUv.x * 21.0 + uTime * 0.55);

        float rippleB =
          sin(vUv.y * 145.0 - vUv.x * 16.0 - uTime * 0.35);

        float rippleC =
          sin(vUv.y * 310.0 + sin(vUv.x * 13.0) * 2.0);

        float highlightA =
          pow(max(0.0, rippleA * 0.5 + 0.5), 23.0);

        float highlightB =
          pow(max(0.0, rippleB * 0.5 + 0.5), 19.0);

        float highlightC =
          pow(max(0.0, rippleC * 0.5 + 0.5), 30.0);

        float highlights =
          highlightA * 0.045 +
          highlightB * 0.035 +
          highlightC * 0.025;

        color += vec3(0.88, 0.94, 0.85) * highlights;

        float age = uTime - uClickTime;

        float ringDistance =
          abs(vClickDistance - max(age, 0.0) * 0.72);

        float clickRing =
          exp(-ringDistance * ringDistance * 35.0) *
          exp(-max(age, 0.0) * 1.0);

        if (age < 0.0 || age > 3.5) {
          clickRing = 0.0;
        }

        color += vec3(0.65, 0.85, 0.79) * clickRing * 0.2;
        color += vec3(0.11, 0.16, 0.14) * abs(vDepression) * 0.4;

        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
}

/* ==========================================
   MAIN ENVIRONMENT
========================================== */

export default function PondEnvironment() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    let disposed = false;
    let animationId;

    const scene = new THREE.Scene();

    // No blue sky: the mountain landscape fills the upper view.
    scene.background = new THREE.Color(0x71877d);
    scene.fog = new THREE.FogExp2(0xbacbc0, 0.0055);

    const camera = new THREE.PerspectiveCamera(
      43,
      Math.max(container.clientWidth, 1) /
        Math.max(container.clientHeight, 1),
      0.1,
      180
    );

    camera.position.set(0, 4.2, 13);
    camera.lookAt(0, 2.0, -10);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 1.5)
    );

    renderer.setSize(
      container.clientWidth,
      container.clientHeight
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;

    container.appendChild(renderer.domElement);

    /* LIGHTING */

    scene.add(
      new THREE.HemisphereLight(
        0xe9f1e8,
        0x657b70,
        1.65
      )
    );

    const sunlight = new THREE.DirectionalLight(
      0xffe6c8,
      1.45
    );

    sunlight.position.set(-8, 13, 5);
    scene.add(sunlight);

    const mountainFill = new THREE.DirectionalLight(
      0xc7e4dc,
      0.75
    );

    mountainFill.position.set(8, 7, -20);
    scene.add(mountainFill);

    const waterFill = new THREE.DirectionalLight(
      0xe4eee0,
      0.55
    );

    waterFill.position.set(0, 5, 10);
    scene.add(waterFill);

    /* MOUNTAIN DISTANCE LAYERS */

    createMountainLayer(scene, {
      z: -51,
      ridgeBase: 17,
      peakHeight: 11,
      base: -4,
      width: 125,
      depth: 14,
      color: 0xa9b9ad,
      seed: 2,
    });

    createMountainLayer(scene, {
      z: -39,
      ridgeBase: 14,
      peakHeight: 9,
      base: -4,
      width: 118,
      depth: 14,
      color: 0x8ca396,
      seed: 8,
    });

    createMountainLayer(scene, {
      z: -27,
      ridgeBase: 10,
      peakHeight: 7,
      base: -4,
      width: 110,
      depth: 12,
      color: 0x657f70,
      seed: 5,
    });

    /* FOREST AND SHORELINE */

    createForest(scene);
    createShoreline(scene);

    /* MOVING MIST */

    const mistGroup = createMist(scene);

    /* WATER */

    const waterMaterial = createWaterMaterial();

    const water = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 180, 180),
      waterMaterial
    );

    water.rotation.x = -Math.PI / 2;
    water.position.set(0, -0.55, -1.5);

    scene.add(water);

    /* WATER CLICK INTERACTION */

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const clock = new THREE.Clock();

    const onWaterClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();

      pointer.x =
        ((event.clientX - rect.left) / rect.width) * 2 - 1;

      pointer.y =
        -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);

      const intersections = raycaster.intersectObject(water);

      if (intersections.length > 0) {
        const localPoint = water.worldToLocal(
          intersections[0].point.clone()
        );

        waterMaterial.uniforms.uClick.value.set(
          localPoint.x,
          localPoint.y
        );

        waterMaterial.uniforms.uClickTime.value =
          clock.getElapsedTime();
      }
    };

    renderer.domElement.addEventListener(
      "pointerdown",
      onWaterClick
    );

    /* ANIMATION */

    const animate = () => {
      if (disposed) return;

      animationId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      waterMaterial.uniforms.uTime.value = time;

      mistGroup.children.forEach((mist, index) => {
        mist.material.uniforms.uTime.value =
          time + index * 1.7;

        mist.position.x =
          Math.sin(time * 0.035 + index) * 1.2;
      });

      renderer.render(scene, camera);
    };

    animate();

    /* RESIZE */

    const resizeObserver = new ResizeObserver(() => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 1.5)
      );
    });

    resizeObserver.observe(container);

    /* CLEANUP */

    return () => {
      disposed = true;

      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();

      renderer.domElement.removeEventListener(
        "pointerdown",
        onWaterClick
      );

      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }

        if (object.material) {
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

          materials.forEach((material) => {
            material.dispose();
          });
        }
      });

      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className="pond-environment"
      ref={containerRef}
      aria-hidden="true"
    />
  );
}
