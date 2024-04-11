<template>
  <div class="viewport-wrapper" style="height: 100%">
    <div class="viewport" ref="modelRef"></div>
    <div class="right-panel"></div>
  </div>
</template>

<script setup lang="ts">
import * as THREE from "three";
// import { EditorControls } from "./plane/EditorControls.ts";
import { onMounted, ref } from "vue";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
// 相机控件
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
const glbPath = "ilyushin-il-76.glb";
const modelRef = ref<HTMLDivElement>();

function createLoader() {
  const loader = new GLTFLoader();
  // DRACOLoader 解析
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("three/examples/jsm/libs/draco/");
  loader.setDRACOLoader(dracoLoader);
  loader.setMeshoptDecoder(MeshoptDecoder);
  return loader;
}

function createCamera() {
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
  camera.far = 1000;
  camera.fov = 50;
  camera.name = "mainCamera";
  camera.position.set(
    134.4151965766654,
    125.93109199524436,
    -199.96192593331008
  );
  camera.rotation.set(
    -2.340847884052145,
    0.499153363783911,
    2.6830742370101204
  );
  return camera;
}

function createScene() {
  const scene = new THREE.Scene();
  scene.name = "scene";
  return scene;
}

function createRenderer(dom: HTMLDivElement) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(dom.offsetWidth, dom.offsetHeight);
  renderer.setClearColor(0xaaaaaa);
  return renderer;
}

const geometries = {};
const materials = {};
const object = {};
const textures = {};
const cameras = {};
const materialsRefCounter = new Map();

function addObject(object, scene, parent?, index?) {
  object.traverse((child) => {
    if (child.geometry !== undefined) addGeometry(child.geometry);
    if (child.material !== undefined) addMaterial(child.material);

    addCamera(child);
  });
  if (parent === undefined) {
    scene.add(object);
  } else {
    parent.children.splice(index, 0, object);
    object.parent = parent;
  }
}

function addCamera(camera: THREE.Camera) {
  if (camera.isCamera) {
    cameras[camera.uuid] = camera;
  }
}

function addGeometry(geometry) {
  geometries[geometry.uuid] = geometry;
}

function addTexture(texture) {
  textures[texture.uuid] = texture;
}

function addMaterialToRefCounter(material) {
  let count = materialsRefCounter.get(material);

  if (count === undefined) {
    materialsRefCounter.set(material, 1);
    materials[material.uuid] = material;
  } else {
    count++;
    materialsRefCounter.set(material, count);
  }
}

function addMaterial(material) {
  if (Array.isArray(material)) {
    for (var i = 0, l = material.length; i < l; i++) {
      addMaterialToRefCounter(material[i]);
    }
  } else {
    addMaterialToRefCounter(material);
  }
}

onMounted(() => {
  // 渲染器
  const renderer = createRenderer(modelRef.value!);
  // 相机
  const camera = createCamera();
  // 场景
  const scene = createScene();
  // 模型加载器
  const loader = createLoader();

  // 生成纹理贴图
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  // 辅助坐标轴
  const axesHelper = new THREE.AxesHelper(20);
  scene.add(axesHelper);
  camera.lookAt(scene.position);

  // 添加材质
  scene.environment = pmremGenerator.fromScene(
    new RoomEnvironment(),
    0.04
  ).texture;

  modelRef.value!.appendChild(renderer.domElement);

  loader.load(glbPath, (result) => {
    renderer.autoClear = false;
    const glbScene = result.scene;
    scene.animations.push(...result.animations);
    scene.add(glbScene);
    addObject(glbScene, scene);
    console.log(result);
    renderer.render(scene, camera);
    const controls = new OrbitControls(camera, renderer.domElement);
    loader.dracoLoader?.dispose();
  });
});
</script>

<style scoped>
.viewport {
  flex: 1;
  height: 100%;
}
.right-panel {
  width: 400px;
  height: 100%;
}

.viewport-wrapper {
  display: flex;
}
</style>
