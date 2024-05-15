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
// import { TransformControls } from "three/addons/controls/TransformControls.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
// 相机控件
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
const glbPath = "ilyushin-il-76.glb";
const modelRef = ref<HTMLDivElement>();

// 创建渲染器
function createLoader() {
  const loader = new GLTFLoader();
  // DRACOLoader 解析
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("three/examples/jsm/libs/draco/");
  loader.setDRACOLoader(dracoLoader);
  loader.setMeshoptDecoder(MeshoptDecoder);
  return loader;
}

// 创建相机
function createCamera() {
 const  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
//  camera.position.z = 100
  const position = {
    "x": 100.49445802914124,
    "y": 10.593457040296611,
    "z": 5.081181309834726
}
  camera.position.set(position.x, position.y, position.z)
  return camera;
}

// 创建场景
function createScene() {
  const scene = new THREE.Scene();
  scene.name = "scene";
  return scene;
}

function createRenderer(dom: HTMLDivElement) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(dom.offsetWidth, dom.offsetHeight);
  // renderer.setSize(1024, 1024);
  renderer.setClearColor(0xaaaaaa);
  renderer.setPixelRatio(window.devicePixelRatio)
  return renderer;
}

// 创建3维立体背景
function createCubeLoader(scene: THREE.Scene) {
  const cubeLoader = new THREE.CubeTextureLoader()
  cubeLoader.setPath('/img/');
  const textureCube = cubeLoader.load(
      ['px.jpg', 'nx.jpg',
      'py.jpg', 'ny.jpg',
      'pz.jpg', 'nz.jpg' ])
  scene.background = textureCube
}

function addLight(scene: THREE.Scene) {
  //增加环境光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 3);
  scene.add(ambientLight);
  //增加点光源
  const pointLight = new THREE.PointLight(0xffffff, 5);
  pointLight.position.set(-500, 1000, 100);
  scene.add(pointLight);
}


function addGridHelpler(scene: THREE.Scene) {
  // scene.add(new THREE.GridHelper(800, 20))
}

// 渲染器
let renderer: THREE.WebGLRenderer;
// 相机
const camera = createCamera();
// 场景
const scene = createScene();
camera.lookAt(scene.position)

// createCubeLoader(scene)
addGridHelpler(scene)
addLight(scene)

  // 辅助坐标轴
const axesHelper = new THREE.AxesHelper(80);
// scene.add(axesHelper);
function render() {
  camera.updateMatrix()
  renderer.render(scene, camera)
}

let mixer: THREE.AnimationMixer

let plane: THREE.Scene 
function onWindowResize() {

camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

renderer.setSize(window.innerWidth, window.innerHeight);

render()

}

  // 创建曲线
  const points = [
	new THREE.Vector3( -20, 50, 20 ),
	new THREE.Vector3( -10, 40, 20 ),
	new THREE.Vector3( -10, 50, -30 ),
	new THREE.Vector3( 10 , 10, -10 ),
	new THREE.Vector3( 10, 20, 50 )
];
// 绘制曲线
const curve = new THREE.CatmullRomCurve3(points, true, 'catmullrom', 0.5);
const pathGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(200))
const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
const curveObject = new THREE.Line(pathGeometry, material);


const curveLength = curve.getLength()
const cpoints = curve.getPoints(500)
console.log(`curveLength`, curveLength)
console.log(cpoints.length)
let startTime = 0
// scene.add(curveObject)

  // 模型加载器
const loader = createLoader();
function animate() {

if (mixer) {
  // 创建Follower
  let follower = new THREE.Object3D();
  scene.add(follower);
  // const path = new THREE.CurvePath(curve.getPoints(200)); // 将曲线转换成路径
  follower.position.copy(curve.getPointAt(0));// 将follower的位置设置在初始位置

  follower.lookAt(curve.getPointAt(0.1)); // 设定为朝向曲线路径的第二个点的方向
  scene.remove(plane);// 删除原来的模型
  follower.add(plane);// 将模型作为子元素添加到follower中 

  const totalTime = curveLength / 1 // 这里的1是速度
  startTime += 0.1;
  const moveTime = startTime % totalTime;
  const distance = (moveTime * 10) % curveLength; //应该移动的距离
  const planePosition = curve.getPointAt(distance / curveLength)//获取follower应该在曲线上的位置
  follower.position.copy(planePosition); // 更新follower的位置
  const lookAhead = 1; // 指定follower朝向曲线路径前方的距离（可根据需要调整）
  let val = (distance + lookAhead) / curveLength
  console.log(`val ${val}`)
  if(val > 1) {
    val = 1
  }
  const target = curve.getPointAt(val); // 获取follower朝向的目标点
  follower.lookAt(target); // 更新follower的朝向
      
}
  // requestAnimationFrame(animate);
  // renderer.render(scene, camera);

requestAnimationFrame(animate)
// setTimeout(animate, 500)
render()
}
onMounted(() => {
  renderer = createRenderer(modelRef.value!)
  // 生成纹理贴图
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const controls = new OrbitControls( camera, renderer.domElement );
  controls.enableZoom = true;
  controls.enablePan = true;
  controls.enabled = true
  // controls.minPolarAngle = Math.PI / 4;
  // controls.maxPolarAngle = Math.PI / 1.5; 
  controls.addEventListener('change', (evnet) => {
    console.log(camera.position)
    render()
  })

  modelRef.value!.appendChild(renderer.domElement);


  // render()
  window.addEventListener( 'resize', onWindowResize );

  // 添加材质
  scene.environment = pmremGenerator.fromScene(
    new RoomEnvironment(),
    0.04
  ).texture;



  // render()


  // console.log(scene)
  //controls



  loader.load('/models/plane.gltf', (result) => {
    renderer.autoClear = false;
    const glbScene = plane = result.scene;
    glbScene.name = 'plane001'
    scene.animations.push(...result.animations);
    glbScene.scale.set(1, 1 ,1)
    scene.add(glbScene);
    console.log(glbScene.position)
    loader.dracoLoader?.dispose();
    mixer = new THREE.AnimationMixer(glbScene) //配合动画使用，稍作解释

    
    render()
    // animate() 
  });

  loader.load('/models/tree.gltf', (result) => {
    renderer.autoClear = false;
    const treeScene = result.scene;
    treeScene.name = 'tree00'
    treeScene.scale.set(2, 2, 2)
    const treeGroup = new THREE.Group()
    // 左面 25个棵树
    let x = 125
    const z = 100
    for(let i =0; i < 25; i++) {
      const clonedTree = treeScene.clone(); // 复制树木模型
        clonedTree.position.set(x, 0, z); // 随机生成位置
        x = x - 10
        treeGroup.add(clonedTree); // 添加到组中
    }
    let x1 = 125
    const z1 = -100
    for(let i =0; i < 25; i++) {
      const clonedTree = treeScene.clone(); // 复制树木模型
        clonedTree.position.set(x1, 0, z1); // 随机生成位置
        x1 = x1 - 10
        treeGroup.add(clonedTree); // 添加到组中
    }
    scene.add(treeGroup)
    render()
  });



render()

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
