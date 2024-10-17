import dat from "dat.gui";
import * as THREE from "three";
import { Ref } from "vue";

export function useSpotLightGui(spotLight: THREE.SpotLight) {
  const gui = new dat.GUI();

  const params = {
    color: spotLight.color.getHex(),
    intensity: spotLight.intensity,
    distance: spotLight.distance,
    angle: spotLight.angle,
    penumbra: spotLight.penumbra,
    decay: spotLight.decay,
    focus: spotLight.shadow.focus,
    positionX: spotLight.position.x,
    positionY: spotLight.position.y,
    positionZ: spotLight.position.z,
  };

  gui.addColor(params, "color").onChange(function (val) {
    spotLight.color.setHex(val);
  });

  gui.add(params, "intensity", 0, 500).onChange(function (val) {
    spotLight.intensity = val;
  });

  gui.add(params, "distance", 0, 20).onChange(function (val) {
    spotLight.distance = val;
  });

  gui.add(params, "angle", 0, Math.PI / 3).onChange(function (val) {
    spotLight.angle = val;
  });

  gui.add(params, "penumbra", 0, 1).onChange(function (val) {
    spotLight.penumbra = val;
  });

  gui.add(params, "decay", 1, 2).onChange(function (val) {
    spotLight.decay = val;
  });

  gui.add(params, "focus", 0, 1).onChange(function (val) {
    spotLight.shadow.focus = val;
  });

  gui.add(params, "positionX", -100, 100).onChange(function (val) {
    spotLight.position.x = val;
  });

  gui.add(params, "positionY", -100, 100).onChange(function (val) {
    spotLight.position.y = val;
  });

  gui.add(params, "positionZ", -100, 100).onChange(function (val) {
    spotLight.position.z = val;
  });
}

export function usePlaneGui(scene: THREE.Group<THREE.Object3DEventMap>) {
  const gui = new dat.GUI();
  const params = {
    rotationX: scene.rotation.x,
    rotationY: scene.rotation.y,
    rotationZ: scene.rotation.z,
    positionX: scene.position.x,
    positionY: scene.position.y,
    positionZ: scene.position.z,
  };

  gui.add(params, "rotationX", -360, 360).onChange(function (val) {
    scene.rotation.x = THREE.MathUtils.degToRad(val);
    scene.rotation.set;
  });

  gui.add(params, "rotationY", -360, 360).onChange(function (val) {
    scene.rotation.y = THREE.MathUtils.degToRad(val);
  });

  gui.add(params, "rotationZ", -360, 360).onChange(function (val) {
    scene.rotation.z = THREE.MathUtils.degToRad(val);
  });

  gui.add(params, "positionX", -360, 360).onChange(function (val) {
    scene.position.x = val;
  });

  gui.add(params, "positionY", -360, 360).onChange(function (val) {
    scene.position.y = val;
  });

  gui.add(params, "positionZ", -360, 360).onChange(function (val) {
    scene.position.z = val;
  });
}

export function useSpeed(refSpeed: Ref<Number>) {
  const gui = new dat.GUI();
  const params = {
    speed: 0.001,
  };

  gui.add(params, "speed", 0.0001, 1).onChange(function (val) {
    refSpeed.value = val;
  });
}
