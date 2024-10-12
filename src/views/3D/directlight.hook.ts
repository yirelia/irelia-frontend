import * as THREE from "three";

/**
 * 创建平行光
 * @returns {directionLight: DirectionalLight}
 */
export function useDirectionLight() {
    const directionLight = new THREE.DirectionalLight('#f3d29a', 10);
    directionLight.position.set(10, 5, 4);
    directionLight.castShadow = true;
    directionLight.shadow.bias = -0.005;
    directionLight.shadow.mapSize.width = 1024;
    directionLight.shadow.mapSize.height = 1024;
    directionLight.shadow.camera.near = 0.01;
    directionLight.shadow.camera.far = 20;
    directionLight.shadow.camera.left = -6.2;
    directionLight.shadow.camera.right = 6.4;
    directionLight.shadow.camera.top = 6;

    return {
        directionLight
    };
}