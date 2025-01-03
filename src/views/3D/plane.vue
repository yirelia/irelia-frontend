<template>
  <div class="flight-wp" ref="domRef">
    <div class="flight-info">
      <el-descriptions :column="1">
        <el-descriptions-item label="偏航角">{{
          deg(yaw.toFixed(2))
        }}</el-descriptions-item>
        <el-descriptions-item label="俯仰角">{{
          deg(pictch.toFixed(2))
        }}</el-descriptions-item>
        <el-descriptions-item label="翻滚角">{{
          deg(roll.toFixed(2))
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
import { ca } from "element-plus/es/locale/index.mjs";

const planePosition = ref(new THREE.Vector3(0, 0, 0));

let helix = null;

const position = computed(() => {
  return `x: ${planePosition.value.x.toFixed(
    2
  )} y:${planePosition.value.y.toFixed(2)} z: ${planePosition.value.z.toFixed(
    2
  )}`;
});

const deg = (rad) => {
  return THREE.MathUtils.radToDeg(rad).toFixed(2);
};

let yaw = ref(0); //
let pictch = ref(0);
let roll = ref(0);

let i = 0;
// const helixRef = ref<THREE.Object3D>();

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
  camera.lookAt(new THREE.Vector3(-100, 50, 20));

  camera.position.set(41, 46, 81);
  // camera.rotation.set(-19, -34, -11);
  // camera.lookAt(new THREE.Vector3(0.958, -0.1539, -0.24065));
  domRef.value?.appendChild(renderer.domElement);
  // 辅助辅助坐标轴
  const axesHelper = new THREE.AxesHelper(20);
  scene.add(axesHelper);
  // 创建飞机跑道
  const runwayGeometry = new THREE.PlaneGeometry(200, 20); // 长方形几何体
  const runwayMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 }); // 深灰色材质
  const runway = new THREE.Mesh(runwayGeometry, runwayMaterial);

  // 旋转跑道，使其平放在地面上
  runway.rotation.x = -Math.PI / 2;
  runway.position.set(100, 0.01, 0); // 稍微抬高跑道以避免Z-fighting

  // 将跑道添加到场景中
  scene.add(runway);

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

      // helix.rotation.z += 1;
      // console.log(helix);
      // console.log(matrix);
      // const matrix = new THREE.Matrix4().multiply(position).makeTranslation().makeTranslation(new THREE.Vector3(1, 0, 0)))
      planeRef.value.matrixAutoUpdate = false;
      planeRef.value.matrix.copy(matrix);
      planeRef.value.matrixWorldNeedsUpdate = true;

      // 更新相机位置和方向，使其跟随飞机
      // camera.position
      //   .copy(planeRef.value.position)
      //   .add(new THREE.Vector3(0, 5, 10)); // 相机在飞机后方上方
      // camera.lookAt(planeRef.value.position);
    }

    renderer.render(scene, camera);
  }

  const loader = new GLTFLoader();
  loader.load("assets/models/plane-c5-0.1.glb", (data) => {
    planeRef.value = data.scene;
    planeRef.value.position.set(-200, 0, 0);
    scene.add(data.scene);
    data.scene.name = "airplane";
    data.scene.position.copy(planePosition);
    renderer.setAnimationLoop(render);
  });

  scene.add(curveObject);
  const textureLoader = new THREE.CubeTextureLoader();
  const texture = textureLoader.load(
    [
      "/img/skybox6/posx.jpg", // right
      "/img/skybox6/negx.jpg", // left
      "/img/skybox6/posy.jpg", // top
      "/img/skybox6/negy.jpg", // bottom
      "/img/skybox6/posz.jpg", // front
      "/img/skybox6/negz.jpg", // back
    ],
    () => {
      scene.background = texture;
      renderer.render(scene, camera);
    }
  );

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true;
  controls.enablePan = true;
  controls.enabled = true;
  controls.addEventListener("change", () => {
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    console.log(
      `camera position: `,
      camera.position,
      camera.rotation,
      direction
    );
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
