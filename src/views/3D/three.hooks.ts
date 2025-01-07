import * as THREE from "three";

export const useCatmullRomCurve3 = () => {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(10, 0, 0),
    new THREE.Vector3(20, 0, 0),
    new THREE.Vector3(25, 10, 0),
    new THREE.Vector3(30, 20, 0),
    new THREE.Vector3(40, 30, 0),
    new THREE.Vector3(50, 50, 0),
    new THREE.Vector3(60, 50, 0),
    new THREE.Vector3(70, 50, 0),
    new THREE.Vector3(80, 50, 0),
    new THREE.Vector3(100, 50, 0),
    new THREE.Vector3(120, 50, 0),
    new THREE.Vector3(130, 40, 0),
    new THREE.Vector3(140, 40, 0),
  ]);

  const points = curve.getPoints(2000);
  console.log("points", points);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

  // Create the final object to add to the scene
  const curveObject = new THREE.Line(geometry, material);
  return {
    curveObject,
    points,
  };
};
