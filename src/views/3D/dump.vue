<template>
  <div class="flight-wp" ref="domRef"></div>
</template>
<script lang="ts" setup>
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// 相机控件
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { onMounted, ref } from "vue";
import { useDirectionLight } from "./directlight.hook";

const domRef = ref<HTMLDivElement>()!;
function createRenderer(dom: HTMLDivElement) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  console.log(`${dom.offsetWidth}`, `${dom.offsetHeight}`);
  renderer.setSize(dom.offsetWidth, dom.offsetHeight);
  renderer.setClearColor(new THREE.Color(0xffffff), 0.5);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  return renderer;
}

onMounted(() => {
  const renderer = createRenderer(domRef.value as HTMLDivElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50,
    domRef.value!.offsetWidth / domRef.value!.offsetHeight,
    0.1,
    1000
  );
  camera.position.set(10, 10, 90);
  camera.lookAt(scene.position);
  domRef.value?.appendChild(renderer.domElement);
  // 辅助辅助坐标轴
  const axesHelper = new THREE.AxesHelper(20);
  scene.add(axesHelper);

  // 添加灯光
  const { directionLight } = useDirectionLight();
  scene.add(directionLight);

  const loader = new GLTFLoader();
  loader.load("assets/models/dmu0718.glb", (data) => {
    scene.add(data.scene);
    // console.log(data.scene);
    data.scene.traverse((child) => {
      if (child.animations && child.animations.length) {
        console.log(child);
      }
    });
    renderer.render(scene, camera);
  });

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true;
  controls.enablePan = true;
  controls.enabled = true;
  controls.addEventListener("change", () => {
    renderer.render(scene, camera);
  });
});
</script>
<style scoped lang="scss">
.flight-wp {
  height: 100%;
  width: 100%;
  position: relative;
}

.flight-info {
  position: absolute;
  left: 10px;
  top: 10px;
  width: 400px;
}
</style>
