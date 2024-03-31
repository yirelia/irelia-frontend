<template>
  <div ref="modelRef" style="height: 100%"></div>
</template>

<script setup lang="ts">
import * as THREE from "three";
import { EditorControls } from "./plane/EditorControls.ts";
import { onMounted, ref } from "vue";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

// import { ViewportPathtracer } from "./plane/ViewportPathtracer.ts";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
// 相机控件
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { verify } from "crypto";
const glbPath = "ilyushin-il-76.glb";
const modelRef = ref<HTMLDivElement>();
const loader = new GLTFLoader();
// DRACOLoader 解析
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( 'three/examples/jsm/libs/draco/' );
loader.setDRACOLoader(dracoLoader)
loader.setMeshoptDecoder( MeshoptDecoder )
// scene.background = new THREE.Color(0, 0, 0);
// 相机
const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
camera.far = 1000;
camera.fov = 50;
camera.name = "mainCamera";
camera.position.set(134.4151965766654, 125.93109199524436, -199.96192593331008);
camera.rotation.set(-2.340847884052145, 0.499153363783911, 2.6830742370101204)


const sceneHelpers = new THREE.Scene();
sceneHelpers.add(new THREE.HemisphereLight(0xffffff, 0x888888, 2));
 const curve =  new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(100, 0, 0),
  new THREE.Vector3(0, 0, 100),
 ])
 curve.curveType = 'catmullrom'
 curve.closed  = true
curve.tension = 0.5

const points = curve.getPoints(50)
const geometry = new THREE.BufferGeometry().setFromPoints(points)
const material = new THREE.LineBasicMaterial({color: 0XFF5733})
const line = new THREE.Line(geometry, material)


onMounted(() => {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(2000, 1000);
  renderer.setViewport(0, 0, 2000, 1000);
  renderer.setClearColor(0xaaaaaa);
  renderer.autoClear = true;
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

  const axesHelper = new THREE.AxesHelper(200);
  mainScene.add(axesHelper);

  mainScene.add(line)

  // camera.lookAt(new THREE.Vector3());
  camera.lookAt(mainScene.position);




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
 let  progress = 0
 let velocity = 0.001



  loader.load(glbPath, (result) => {
    renderer.autoClear = false;
    const scene = result.scene;
    scene.animations.push(...result.animations);
    mainScene.add(scene);
    renderer.render(mainScene, camera);
    // renderer.render(sceneHelpers, camera);

    // 添加示例协助参考面
    // renderer.render(grid, camera);
    const controls = new OrbitControls(camera, renderer.domElement);

    const moveOnline = () => {
    if(progress <= 1 - velocity) {
      const point = curve.getPoint(progress)
      const pointBox = curve.getPointAt(progress + velocity)
      console.log(`point pointBox`, point, pointBox)
      if(point && pointBox) {
        scene.position.set(point.x, point.y, point.z)
        let targetPos = pointBox
        let offsetAngle = 0

        let mtx = new THREE.Matrix4()
        mtx.lookAt(scene.position, targetPos, scene.up)

        mtx.multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0, offsetAngle, 0)))

        const toRot = new THREE.Quaternion().setFromRotationMatrix(mtx)
        scene.quaternion.slerp(toRot, 0.2)


      }
      progress += velocity
    } else {
      progress = 0
    }
  }

  const an = () => {
    requestAnimationFrame(an)
    moveOnline()
    renderer.render(mainScene, camera);
  }
  an()

    // const controls = new EditorControls(camera, modelRef.value);

    // controls.addEventListener("change", function () {
    //   console.log(`[camera]`, camera)
    //   // pathtracer.reset();
    //   renderer.render(mainScene, camera);
    //   // renderer.render(sceneHelpers, camera);

    //   // 添加示例协助参考面
    //   // renderer.render(grid, camera);

    //   // signals.cameraChanged.dispatch(camera);
    //   // signals.refreshSidebarObject3D.dispatch(camera);
    // });
  });
});
</script>

<style scoped></style>
