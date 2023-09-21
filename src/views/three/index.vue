<!--
 * @Author: simtek/yangrui 17368465776@163.com
 * @Date: 2023-09-11 09:32:17
 * @LastEditors: simtek/yangrui 17368465776@163.com
 * @LastEditTime: 2023-09-20 17:07:59
 * @FilePath: \irelia-frontend\src\views\svg\test-svg.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%A100
-->
<template>
<div ref="modelRef"></div>
 </template>
 
 <script setup lang="ts">
 import *  as THREE from 'three'
 import { onMounted ,ref} from 'vue';
 import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
 import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
const modelRef = ref<HTMLDivElement>()
const loader = new GLTFLoader()

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 1000, 1000)
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
 
 onMounted(() => {
   modelRef.value!.appendChild(renderer.domElement)
    loader.load('cadImport_tube.glb', (gltf) => {
    console.log(gltf)
    scene.add(gltf.scene )
    console.log(gltf.cameras)
    renderer.render( scene, camera );
 }) 
 })
 </script>
 
 <style scoped>
 
 </style>