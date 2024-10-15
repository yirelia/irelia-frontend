<template>
    <div class="container" ref="container"></div>
</template>

<script lang="ts" setup>
    import { ref, onMounted, onUnmounted } from 'vue';
    import * as THREE from 'three';
    import {
        PerspectiveCamera, Scene, DirectionalLight, WebGLRenderer,
        Mesh,
        BoxGeometry,
        MeshBasicMaterial,
        Color, CatmullRomCurve3,
        Vector3,
        BufferGeometry,
        BufferAttribute,
        PointsMaterial,
        Points,
        AxesHelper,
        LineCurve3,
        CurvePath,
        TubeGeometry,
        Curve
    } from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
    import { useSpeed } from './dat.hook';

    const container = ref<HTMLDivElement>();

    let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer, controls: OrbitControls;
    let particleSystem: Points, particleSystem2: Points, particleGeometry: BufferGeometry, particleGeometry2: BufferGeometry
    curve: CatmullRomCurve3;

    let particleSpeed = ref(0.0008), particleOffset = 1;
    useSpeed(particleSpeed)
    onMounted(() => {
        // 初始化相机
        camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        // camera.position.z = 5;

        camera.position.set(0, 0, 50);

        // 初始化场景
        scene = new Scene();
        scene.background = new Color().set(92, 192, 192);

        // 初始化渲染器
        renderer = new WebGLRenderer({
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        // renderer.
        container.value!.appendChild(renderer.domElement);

        // 初始化轨道控制
        controls = new OrbitControls(camera, renderer.domElement);

        // 定义 Z 型管道的控制点
        const points = [
            new Vector3(-20, 20, 0),
            new Vector3(0, 20, 0),
            new Vector3(0, 0, 0),
            new Vector3(20, 0, 0),
        ];

        const points1 = [
            new Vector3(-20, 21, 0),
            new Vector3(0, 21, 0),
            new Vector3(0, 0, 0),
            new Vector3(20, 1, 0),
        ];

        const points2 = [
            new Vector3(-20, 18.5, 0),
            new Vector3(0, 18.5, 0),
            new Vector3(-1, -1, 0),
            new Vector3(20, -1, 0),
        ];
        const curve1 = new CatmullRomCurve3(points1);
        const curve2 = new CatmullRomCurve3(points2);
        let particlePositions1: Float32Array, particlePositions2: Float32Array, particleCount = 60;
        let particleColors1: Float32Array
        let particleColors2: Float32Array
        const createParticleSystem1 = () => {
            const point = curve1.getPointAt(0);
            particlePositions1 = new Float32Array(particleCount * 3);
            particleColors1 = new Float32Array(particleCount * 3);
            // for (let i = 0; i < particleCount; i++) {
            //     const point = linePoints[i]
            //     particlePositions1[i * 3] = point.x;
            //     particlePositions1[i * 3 + 1] = point.y;
            //     particlePositions1[i * 3 + 2] = point.z;

            //     const color = new Color();
            //     color.setHSL(i, 1.0, 0.5); // 使用 HSL 颜色模型，根据 t 值设置颜色
            //     particleColors1[i * 3] = color.r;
            //     particleColors1[i * 3 + 1] = color.g;
            //     particleColors1[i * 3 + 2] = color.b;
            // }

            particleGeometry = new BufferGeometry();
            particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions1, 3));
            particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors1, 3));
            const particleMaterial = new PointsMaterial({ vertexColors: true, size: 0.6 });
            particleSystem = new Points(particleGeometry, particleMaterial);
            scene.add(particleSystem);
        };
        const createParticleSystem2 = () => {
            particlePositions2 = new Float32Array(particleCount * 3);
            particleColors2 = new Float32Array(particleCount * 3);
            particleGeometry2 = new BufferGeometry();
            particleGeometry2.setAttribute('position', new THREE.BufferAttribute(particlePositions2, 3));
            particleGeometry2.setAttribute('color', new THREE.BufferAttribute(particleColors2, 3));
            const particleMaterial = new PointsMaterial({ color: 0x0000ff, size: 0.4 });
            particleSystem2 = new Points(particleGeometry2, particleMaterial);
            scene.add(particleSystem2);
        };



        const linePoints = curve1.getPoints(particleCount)
        console.log(`line points`, linePoints)
        const updateParticles1 = (curve1) => {
            for (let i = 0; i < particleCount; i++) {
                console.log(`value is `, i / particleCount + particleOffset)
                const t = (i / particleCount + particleOffset) % 1;
                const point = curve1.getPointAt(t);
                particlePositions1[i * 3] = point.x;
                particlePositions1[i * 3 + 1] = point.y;
                particlePositions1[i * 3 + 2] = point.z;
            }
            particleOffset += particleSpeed.value;
            particleGeometry.attributes.position.needsUpdate = true;
            particleGeometry.attributes.color.needsUpdate = true
        };

        const updateParticles2 = (curve2) => {
            for (let i = 0; i < particleCount; i++) {
                console.log(`value is `, i / particleCount + particleOffset)
                const t = (i / particleCount + particleOffset) % 1;
                const point = curve2.getPointAt(t);
                particlePositions2[i * 3] = point.x;
                particlePositions2[i * 3 + 1] = point.y;
                particlePositions2[i * 3 + 2] = point.z;
            }
            particleOffset += particleSpeed.value;
            particleGeometry2.attributes.position.needsUpdate = true;
            particleGeometry2.attributes.color.needsUpdate = true
        };
        createParticleSystem1()
        createParticleSystem2()



        // 创建 CatmullRomCurve3 曲线
        const curve = new CatmullRomCurve3(points);
        const geometry = new TubeGeometry(curve, 64, 2, 8);
        const material = new MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.4 });
        const tube = new Mesh(geometry, material);
        scene.add(tube);
        // 添加坐标轴
        const axesHelper = new AxesHelper(100); // 参数为坐标轴的长度
        scene.add(axesHelper);

        new GLTFLoader().load('models/scene.gltf', (gltf) => {
            scene.add(gltf.scene);
        });

        // 渲染循环
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            updateParticles1(curve1)
            updateParticles2(curve2)
            renderer.render(scene, camera);
        };
        animate();




        // 处理窗口大小调整
        window.addEventListener('resize', onWindowResize);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', onWindowResize);
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