<template>
  <div class="container" ref="container"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useSpeed } from "./dat.hook";

const container = ref<HTMLDivElement>();

let camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  controls: OrbitControls;

let particleSystem: THREE.Points, particleGeometry: THREE.BufferGeometry;

let particleSpeed = ref(0.0001),
  particleOffset = 0.1;
useSpeed(particleSpeed);
onMounted(() => {
  // 初始化相机
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  // camera.position.z = 5;

  camera.position.set(0, 0, 50);

  // 初始化场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color().set(92, 192, 192);

  // 初始化渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.
  container.value!.appendChild(renderer.domElement);

  // 初始化轨道控制
  controls = new OrbitControls(camera, renderer.domElement);
  // 创建一个CurvePath
  const tubePath = new THREE.CurvePath<THREE.Vector3>();

  const color1 = new THREE.Color(255, 69, 0);
  const color2 = new THREE.Color(255, 0, 0);

  // 创建两个线性路径并添加到CurvePath

  const line1 = new THREE.LineCurve3(
    new THREE.Vector3(-20, 20, 0),
    new THREE.Vector3(0, 20, 0)
  );
  const line2 = new THREE.LineCurve3(
    new THREE.Vector3(0, 20, 0),
    new THREE.Vector3(0, 0, 0)
  );

  const line3 = new THREE.LineCurve3(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(20, 0, 0)
  );

  tubePath.curves.push(line1, line2, line3);
  const tubeGeometry = new THREE.TubeGeometry(tubePath, 20, 4, 8, false);
  // 创建一个MeshBasicMaterial
  const tubeMaterial = new THREE.MeshBasicMaterial({
    color: "#C0C0C0",
    opacity: 0.2,
    transparent: true,
  });

  // 创建一个Mesh并添加到场景
  const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
  let particlePositions: Float32Array,
    particleColors: Float32Array,
    particleCount = 20;
  const createParticleSystem = () => {
    particlePositions = new Float32Array(particleCount * 3);
    particleColors = new Float32Array(particleCount * 3);

    particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );
    particleGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(particleColors, 3)
    );
    const particleMaterial = new THREE.PointsMaterial({
      vertexColors: true,
      size: 2,
      opacity: 1,
      transparent: false,
    });
    particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
  };

  createParticleSystem();

  const updateParticles = (tubePath: THREE.CurvePath<THREE.Vector3>) => {
    for (let i = 0; i < particleCount; i++) {
      const t = (i / particleCount + particleOffset) % 1;
      const point = tubePath.getPointAt(t);
      particlePositions[i * 3] = point.x;
      particlePositions[i * 3 + 1] = point.y;
      particlePositions[i * 3 + 2] = point.z;

      if (point.x < 0) {
        particleColors[i * 3] = color1.r;
        particleColors[i * 3 + 1] = color1.g;
        particleColors[i * 3 + 2] = color1.b;
      } else {
        particleColors[i * 3] = color2.r;
        particleColors[i * 3 + 1] = color2.g;
        particleColors[i * 3 + 2] = color2.b;
      }
    }
    particleOffset += particleSpeed.value;
    particleGeometry.attributes.position.needsUpdate = true;
    particleGeometry.attributes.color.needsUpdate = true;
  };
  // 添加坐标轴
  const axesHelper = new THREE.AxesHelper(100); // 参数为坐标轴的长度
  scene.add(axesHelper);

  scene.add(tubeMesh);

  // 渲染循环
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    updateParticles(tubePath);
    renderer.render(scene, camera);
  };
  animate();

  // 处理窗口大小调整
  window.addEventListener("resize", onWindowResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", onWindowResize);
});

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
