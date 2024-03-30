<template>
  <div ref="modelRef" style="height: 100%"></div>
</template>

<script setup lang="ts">
import * as THREE from "three";
import { EditorControls } from "./plane/EditorControls.ts";
import { onMounted, ref } from "vue";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import { ViewportPathtracer } from "./plane/ViewportPathtracer.ts";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
const glbPath = "ilyushin-il-76.glb";
const modelRef = ref<HTMLDivElement>();
const loader = new GLTFLoader();

// scene.background = new THREE.Color(0, 0, 0);
// 相机
const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
camera.far = 1000;
camera.fov = 50;
camera.name = "mainCamera";
camera.position.set(36, 33, -0.377);
camera.lookAt(new THREE.Vector3());

const sceneHelpers = new THREE.Scene();
sceneHelpers.add(new THREE.HemisphereLight(0xffffff, 0x888888, 2));
onMounted(() => {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(2000, 1000);
  renderer.setViewport(0, 0, 2000, 1000);
  renderer.setClearColor(0xaaaaaa);
  renderer.autoClear = false;
  const grid = new THREE.Group();

  const grid1 = new THREE.GridHelper(30, 30, 0x888888);
  grid1.material.color.setHex(0x888888);
  grid1.material.vertexColors = false;
  grid.add(grid1);

  const grid2 = new THREE.GridHelper(30, 6, 0x222222);
  grid2.material.color.setHex(0x222222);
  grid2.material.vertexColors = false;
  grid.add(grid2);

  const box = new THREE.Box3();

  const selectionBox = new THREE.Box3Helper(box);
  selectionBox.visible = false;
  sceneHelpers.add(selectionBox);

  // 和材质相关
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  // 创建场景
  const mainScene = new THREE.Scene();
  mainScene.name = "mainScene";
  modelRef.value!.appendChild(renderer.domElement);

  // 添加材质
  mainScene.environment = pmremGenerator.fromScene(
    new RoomEnvironment(),
    0.04
  ).texture;

  // const pathtracer = new ViewportPathtracer(renderer);

  // 添加控制
  const transformControls = new TransformControls(camera, modelRef.value);
  transformControls.addEventListener("mouseDown", function () {
    // const object = transformControls.object;
    // objectPositionOnDown = object?.position.clone();
    // objectRotationOnDown = object?.rotation.clone();
    // objectScaleOnDown = object?.scale.clone();
    // controls.enabled = false;
  });

  loader.load(glbPath, (result) => {
    const scene = result.scene;
    scene.animations.push(...result.animations);
    mainScene.add(scene);
    renderer.render(mainScene, camera);
    renderer.render(sceneHelpers, camera);

    // 添加示例协助参考面
    renderer.render(grid, camera);

    const controls = new EditorControls(camera, modelRef.value);

    controls.addEventListener("change", function () {
      // pathtracer.reset();
      renderer.render(mainScene, camera);
      renderer.render(sceneHelpers, camera);

      // 添加示例协助参考面
      renderer.render(grid, camera);

      // signals.cameraChanged.dispatch(camera);
      // signals.refreshSidebarObject3D.dispatch(camera);
    });
  });
});
</script>

<style scoped></style>
