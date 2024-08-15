<template>
    <div class="flight-wp" ref="domRef">
    </div>
</template>
<script lang='ts' setup>
    import * as THREE from "three";
    import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
    // 相机控件
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
    import { onMounted, ref } from "vue";
    import * as dat from 'dat.gui';
    import { useDirectionLight } from "./directlight.hook";
    import { usePlaneGui } from "./dat.hook";
    import { Matrix4 } from "three";
    import { useControl } from "./control.hook";

    const planePosition = new THREE.Vector3(-10, 4, 0)

    const helixRef = ref<THREE.Object3D>()

    const planeRef = ref<THREE.Group<THREE.Object3DEventMap>>()

    const domRef = ref<HTMLDivElement>()!;
    function createRenderer(dom: HTMLDivElement) {
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        console.log(`${dom.offsetWidth}`, `${dom.offsetHeight}`)
        renderer.setSize(dom.offsetWidth, dom.offsetHeight);
        renderer.setClearColor(new THREE.Color(0x000000));
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.shadowMap.enabled = true
        return renderer;
    }

    const Keys: Record<string, boolean> = {}

    onMounted(() => {
        window.addEventListener("keydown", (e) => {
            Keys[e.key.toLowerCase()] = true;
        });

        window.addEventListener("keyup", (e) => {
            Keys[e.key.toLowerCase()] = false;
        });
        const renderer = createRenderer(domRef.value as HTMLDivElement)
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, domRef.value!.offsetWidth / domRef.value!.offsetHeight, 0.1, 1000);
        camera.position.set(-30, 60, 0)
        // const cameraHelper = new THREE.CameraHelper(camera);
        // scene.add(cameraHelper)
        camera.lookAt(scene.position)
        domRef.value?.appendChild(renderer.domElement)
        // 辅助辅助坐标轴
        const axesHelper = new THREE.AxesHelper(20)
        scene.add(axesHelper)

        // 平面
        const planeGeometry = new THREE.PlaneGeometry(100, 50);
        const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.castShadow = true;
        plane.receiveShadow = true;
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.set(10, 0, 0);
        scene.add(plane);

        const sphereGeometry = new THREE.SphereGeometry(60, 50, 50)
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        sphereMaterial.map = new THREE.TextureLoader().load('assets/textures/envmap.jpg')
        sphereMaterial.side = THREE.BackSide
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere)


        const loader = new GLTFLoader();
        loader.load('assets/models/airplane.glb', (data) => {
            planeRef.value = data.scene
            scene.add(data.scene)
            data.scene.rotation.y = THREE.MathUtils.degToRad(90)
            data.scene.name = 'airplane'
            console.log(data.scene)
            helixRef.value = data.scene.getObjectByName('helix')
            console.log(helixRef.value, planeRef.value)
            render()

        })
        const { directionLight } = useDirectionLight()
        scene.add(directionLight)

        let xRot = 0

        function render() {
            // const plane = scene.getObjectByName('airplane')

            if (planeRef.value) {
                if (Keys['w']) {
                    planePosition.add(new THREE.Vector3(0.1, 0.1, 0))

                }
                if (Keys['s']) {
                    planePosition.add(new THREE.Vector3(-0.1, -0.1, 0))
                }
                if (Keys['a']) {
                    xRot -= 10
                }
                if (Keys['d']) {
                    xRot += 10
                }

                console.log(planePosition)
                // 飞机头正向x轴
                const rotationMatrix = new THREE.Matrix4().makeRotationY(THREE.MathUtils.degToRad(90))
                const xRotMartix = new THREE.Matrix4().makeRotationZ(THREE.MathUtils.degToRad(xRot))
                const matrix = new THREE.Matrix4().multiply(new THREE.Matrix4()
                    .makeTranslation(planePosition.x, planePosition.y, planePosition.z))
                    .multiply(rotationMatrix).multiply(xRotMartix);
                console.log(matrix)
                planeRef.value.matrixAutoUpdate = false;
                planeRef.value.matrix.copy(matrix);
                planeRef.value.matrixWorldNeedsUpdate = true;

            }

            // const cameraMatrix = new THREE.Matrix4()
            //     .multiply(new Matrix4().makeTranslation(planePosition.x, planePosition.y, planePosition.z))
            //     .multiply(delayedRotMatrix)
            //     .multiply(new Matrix4().makeRotationX(-0.2))
            //     .multiply(
            //         new Matrix4().makeTranslation(0, 0.015, 0.3)
            //     );

            // camera.matrixAutoUpdate = false;
            // camera.matrix.copy(cameraMatrix);
            // camera.matrixWorldNeedsUpdate = true;


            if (helixRef.value) {
                helixRef.value.rotation.z += 1
            }

            renderer.render(scene, camera);

        }


        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = true;
        controls.enablePan = true;
        controls.enabled = true
        controls.addEventListener('change', () => {
            renderer.render(scene, camera)
        })

        const gui = new dat.GUI()

        const params = {
            a: false,
            s: false,
            d: false,
            w: false
        }

        gui.add(params, 'a').onChange((v) => {
            Keys['a'] = v
        })

        gui.add(params, 's').onChange((v) => {
            Keys['s'] = v
        })

        gui.add(params, 'd').onChange((v) => {
            Keys['d'] = v
        })
        gui.add(params, 'w').onChange((v) => {
            Keys['w'] = v
        })

        renderer.setAnimationLoop(render);

    })



</script>
<style scoped lang="scss">
.flight-wp {
    height: 100%;
    width: 100%;
}
</style>