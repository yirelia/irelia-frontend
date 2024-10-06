<template>
    <div class="container" ref="container"></div>
</template>

<script lang="ts" setup>
    import { ref, onMounted, onUnmounted } from 'vue';
    import { PerspectiveCamera, Scene, DirectionalLight, WebGLRenderer, Mesh, BoxGeometry, MeshBasicMaterial, Color, CatmullRomCurve3, Vector3, BufferGeometry, BufferAttribute, PointsMaterial, Points, AxesHelper } from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

    const container = ref<HTMLDivElement>();

    let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer, controls: OrbitControls;
    let particleSystem: Points, particleGeometry: BufferGeometry, path: CatmullRomCurve3;
    let particlePositions: Float32Array, particleCount = 1000;
    let particleSpeed = 0.001, particleOffset = 0;
    onMounted(() => {
        // 初始化相机
        camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        // camera.position.z = 5;

        camera.position.set(10, 10, 10);

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

        // 添加平行光
        const directionalLight = new DirectionalLight(0xffffff, 1); // 白色光，强度为1
        directionalLight.position.set(10, 10, 10); // 设置光源位置
        scene.add(directionalLight);


        // 添加坐标轴
        const axesHelper = new AxesHelper(5); // 参数为坐标轴的长度
        scene.add(axesHelper);

        // 加载 GLTF 模型
        const loader = new GLTFLoader();
        loader.load('/assets/models/tube.glb', (gltf: any) => {
            scene.add(gltf.scene);
            scene.updateMatrixWorld(true)
            // const worldPosition = gltf.scene.getWorldPosition()
            // console.log(`worldPositio`, worldPosition)
            console.log(`旋转角度 ${gltf.scene.rotation.x} ${gltf.scene.rotation.y} ${gltf.scene.rotation.z}`);
            // 提取路径
            const pathPoints: Vector3[] = [];
            console.log(`scene geometry`, gltf.scene.geometry)
            let num = 0
            gltf.scene.traverse((child: any) => {
                if (child.isMesh) {
                    child.material.transparent = true;
                    child.material.opacity = 0.2;
                    const geometry = child.geometry;
                    // child.rotation.x = 0


                    const positionAttribute = geometry.attributes.position;
                    console.log(`positionAttribute ${num++}`, positionAttribute)
                    for (let i = 0; i < positionAttribute.count; i++) {
                        // const 
                        // const x = positionAttribute.getX(i);
                        // const y = positionAttribute.getY(i);
                        // const z = positionAttribute.getZ(i);
                        // pathPoints.push(new Vector3(x, y, z));
                        const localVertex = new Vector3();
                        localVertex.fromBufferAttribute(positionAttribute, i);
                        console.log(`localVertex`, localVertex)
                        const worldVertex = child.localToWorld(localVertex);
                        pathPoints.push(worldVertex);
                    }
                }
            });

            // const sortedPathPoints = pathPoints.sort((a, b) => a.x - b.x || a.y - b.y || a.z - b.z);
            path = new CatmullRomCurve3(pathPoints);
            createParticleSystem(path);
        });

        // 创建粒子系统
        const createParticleSystem = (path: CatmullRomCurve3) => {
            const particles = new Float32Array(particleCount * 3);
            const tubeLength = path.getLength();

            for (let i = 0; i < particleCount; i++) {
                const t = (i / particleCount) * tubeLength;
                const point = path.getPointAt(t / tubeLength);
                particles[i * 3] = point.x;
                particles[i * 3 + 1] = point.y;
                particles[i * 3 + 2] = point.z;
            }

            const particleGeometry = new BufferGeometry();
            particleGeometry.setAttribute('position', new BufferAttribute(particles, 3));

            const particleMaterial = new PointsMaterial({ color: 0xff0000, size: 0.1 });
            particleSystem = new Points(particleGeometry, particleMaterial);
            scene.add(particleSystem);
        };

        // 渲染循环
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            // updateParticles();
            renderer.render(scene, camera);
        };
        animate();

        // 更新粒子位置
        function updateParticles() {
            if (path) {
                const tubeLength = path.getLength();
                for (let i = 0; i < tubeLength - 1; i++) {
                    const t = (i / 10 + particleOffset) % 1;
                    const point = path.getPointAt(t);
                    particlePositions[i * 3] = point.x;
                    particlePositions[i * 3 + 1] = point.y;
                    particlePositions[i * 3 + 2] = point.z;
                }
                particleOffset += particleSpeed;
                particleGeometry.attributes.position.needsUpdate = true;
            }

        };

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