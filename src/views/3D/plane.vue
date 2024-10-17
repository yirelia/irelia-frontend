<template>
  <div class="flight-wp" ref="domRef">
    <div class="flight-info">
      <el-descriptions :column="1">
        <el-descriptions-item label="偏航角">{{
          yaw.toFixed(2)
        }}</el-descriptions-item>
        <el-descriptions-item label="俯仰角">{{
          pictch.toFixed(2)
        }}</el-descriptions-item>
        <el-descriptions-item label="翻滚角">{{
          roll.toFixed(2)
        }}</el-descriptions-item>
        <el-descriptions-item label="坐标">{{ position }}</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>
<script lang="ts" setup>
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// 相机控件
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { computed, onMounted, ref } from "vue";
import { useDirectionLight } from "./directlight.hook";
import { useCatmullRomCurve3 } from "./three.hooks";
import { Matrix4 } from "three";

const planePosition = ref(new THREE.Vector3(0, 0, 0));

const position = computed(() => {
  return `x: ${planePosition.value.x.toFixed(
    2
  )} y:${planePosition.value.y.toFixed(2)} z: ${planePosition.value.z.toFixed(
    2
  )}`;
});

let yaw = ref(0); //
let pictch = ref(0);
let roll = ref(0);

let i = 0;
const helixRef = ref<THREE.Object3D>();

const planeRef = ref<THREE.Group<THREE.Object3DEventMap>>();

const domRef = ref<HTMLDivElement>()!;
function createRenderer(dom: HTMLDivElement) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  console.log(`${dom.offsetWidth}`, `${dom.offsetHeight}`);
  renderer.setSize(dom.offsetWidth, dom.offsetHeight);
  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  return renderer;
}

const Keys: Record<string, boolean> = {};

onMounted(() => {
  window.addEventListener("keydown", (e) => {
    Keys[e.key.toLowerCase()] = true;
  });

  window.addEventListener("keyup", (e) => {
    Keys[e.key.toLowerCase()] = false;
  });

  const { curveObject, points } = useCatmullRomCurve3();
  const renderer = createRenderer(domRef.value as HTMLDivElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50,
    domRef.value!.offsetWidth / domRef.value!.offsetHeight,
    0.1,
    1000
  );
  camera.position.set(50, 90, 90);
  camera.lookAt(scene.position);
  domRef.value?.appendChild(renderer.domElement);
  // 辅助辅助坐标轴
  const axesHelper = new THREE.AxesHelper(20);
  scene.add(axesHelper);

  // 平面
  const planeGeometry = new THREE.PlaneGeometry(100, 60);
  const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.castShadow = true;
  plane.receiveShadow = true;
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.set(10, -10, 0);
  scene.add(plane);
  // 添加灯光
  const { directionLight } = useDirectionLight();
  scene.add(directionLight);

  function render() {
    if (planeRef.value) {
      if (Keys["a"]) {
        roll.value += 0.01;
      }
      if (Keys["d"]) {
        roll.value -= 0.01;
      }

      if (Keys["w"]) {
        pictch.value += 0.01;
      }
      if (Keys["s"]) {
        pictch.value -= 0.01;
      }
      if (Keys["q"]) {
        yaw.value += 0.01;
      }
      if (Keys["e"]) {
        yaw.value -= 0.01;
      }
      if (i < points.length) {
        planePosition.value = points[i];
        i++;
      } else {
        i = 0;
      }
      const rotationMatrix = new Matrix4().makeRotationFromEuler(
        new THREE.Euler(roll.value, yaw.value, pictch.value, "ZYX")
      );
      const translationMatrix = new Matrix4().makeTranslation(
        planePosition.value.x,
        planePosition.value.y,
        planePosition.value.z
      );
      const matrix = new Matrix4()
        .multiply(translationMatrix)
        .multiply(rotationMatrix);

      console.log(matrix);
      // const matrix = new THREE.Matrix4().multiply(position).makeTranslation().makeTranslation(new THREE.Vector3(1, 0, 0)))
      planeRef.value.matrixAutoUpdate = false;
      planeRef.value.matrix.copy(matrix);
      planeRef.value.matrixWorldNeedsUpdate = true;
    }

    renderer.render(scene, camera);
  }

  function genPosition() {
    const x = Math.random() * 100 - 50;
    const y = Math.random() * 100 - 50;
    const z = Math.random() * 100 - 50;
    return new THREE.Vector3(x, y, z);
  }

  const loader = new GLTFLoader();
  loader.load("assets/models/zyx.glb", (data) => {
    planeRef.value = data.scene;
    scene.add(data.scene);
    data.scene.name = "airplane";
    data.scene.position.copy(planePosition);
    renderer.setAnimationLoop(render);
  });

  scene.add(curveObject);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true;
  controls.enablePan = true;
  controls.enabled = true;
  controls.addEventListener("change", () => {
    renderer.render(scene, camera);
  });

  // render()
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
