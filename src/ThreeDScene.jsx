
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

function ThreeDScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDisposed = false;
    let animationId = null;
    let modelGroup = null;
    let isDragging = false;
    let previousX = 0;
    let previousY = 0;
    let pointerId = null;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      Math.max(container.clientWidth, 1) /
        Math.max(container.clientHeight, 1),
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
    renderer.setSize(
      Math.max(container.clientWidth, 1),
      Math.max(container.clientHeight, 1)
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.cursor = "grab";

    container.appendChild(renderer.domElement);

    // ENVIRONMENT REFLECTIONS FOR THE GLASS MATERIAL
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnvironment = new RoomEnvironment();
    const environmentMap = pmremGenerator.fromScene(roomEnvironment);

    scene.environment = environmentMap.texture;

    roomEnvironment.dispose();
    pmremGenerator.dispose();

    // SOFT LIGHTING FOR THE LOTUS ONLY
    scene.add(new THREE.AmbientLight(0xeaf5f1, 1.8));

    const mainLight = new THREE.DirectionalLight(0xfff0dc, 3.0);
    mainLight.position.set(-3, 6, 5);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xd9d0f0, 1.5);
    fillLight.position.set(4, 1, 4);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xc6eee6, 2.0);
    backLight.position.set(0, 3, -5);
    scene.add(backLight);

    const lavenderLight = new THREE.PointLight(0xcbb9f0, 12, 16);
    lavenderLight.position.set(-3, 1.5, 3);
    scene.add(lavenderLight);

    const pinkLight = new THREE.PointLight(0xf1d0df, 9, 16);
    pinkLight.position.set(3, -1, 2);
    scene.add(pinkLight);

    // LOAD THE EXISTING LOTUS MODEL
    const loader = new GLTFLoader();

    loader.load(
      "/models/my-model.glb",
      (gltf) => {
        if (isDisposed) {
          gltf.scene.traverse((object) => {
            if (object.geometry) object.geometry.dispose();
          });
          return;
        }

        const model = gltf.scene;

        // CENTER THE MODEL
        const bounds = new THREE.Box3().setFromObject(model);
        const center = bounds.getCenter(new THREE.Vector3());
        const size = bounds.getSize(new THREE.Vector3());

        model.position.set(-center.x, -center.y, -center.z);

        // NORMALIZE THE MODEL SIZE
        const maxDimension = Math.max(size.x, size.y, size.z);

        if (maxDimension > 0) {
          model.scale.setScalar(2.1 / maxDimension);
        }

        // APPLY THE GLASS FINISH
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
                ? original.color.clone().lerp(
                    new THREE.Color("#e8c7ef"),
                    0.55
                  )
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

    // MOUSE AND TOUCH DRAG ROTATION
    const canvas = renderer.domElement;

    const onPointerDown = (event) => {
      if (!modelGroup) return;

      isDragging = true;
      pointerId = event.pointerId;

      previousX = event.clientX;
      previousY = event.clientY;

      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
    };

    const onPointerMove = (event) => {
      if (!isDragging || !modelGroup || event.pointerId !== pointerId) {
        return;
      }

      const deltaX = event.clientX - previousX;
      const deltaY = event.clientY - previousY;

      modelGroup.rotation.y += deltaX * 0.008;
      modelGroup.rotation.x += deltaY * 0.008;

      previousX = event.clientX;
      previousY = event.clientY;
    };

    const stopDragging = (event) => {
      if (pointerId !== null && event.pointerId !== pointerId) return;

      isDragging = false;
      pointerId = null;
      canvas.style.cursor = "grab";
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", stopDragging);
    canvas.addEventListener("pointercancel", stopDragging);
    canvas.addEventListener("lostpointercapture", stopDragging);

    // RESPONSIVE CANVAS
    const resizeObserver = new ResizeObserver(() => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    });

    resizeObserver.observe(container);

    // GENTLE IDLE ROTATION
    const clock = new THREE.Clock();

    const animate = () => {
      if (isDisposed) return;

      animationId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      if (modelGroup && !isDragging) {
        modelGroup.rotation.y += 0.0015;
        modelGroup.position.y = Math.sin(time * 0.7) * 0.07;
      }

      lavenderLight.position.x = -3 + Math.sin(time * 0.3) * 0.5;
      pinkLight.intensity = 9 + Math.sin(time * 0.7) * 1.5;

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      isDisposed = true;

      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }

      resizeObserver.disconnect();

      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", stopDragging);
      canvas.removeEventListener("pointercancel", stopDragging);
      canvas.removeEventListener("lostpointercapture", stopDragging);

      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }

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
