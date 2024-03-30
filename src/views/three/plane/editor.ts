import { signals } from "signals";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import mitt from "mitt";
const emitter = mitt();

const _DEFAULT_CAMERA = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
_DEFAULT_CAMERA.name = "Camera";
_DEFAULT_CAMERA.position.set(0, 5, 10);
_DEFAULT_CAMERA.lookAt(new THREE.Vector3());

export class Editor {
  // 信号
  public signals = {};
  public camera = _DEFAULT_CAMERA.clone();
  public scene = new THREE.Scene();
  public sceneHelpers = new THREE.Scene();

  public viewportCamera = this.camera;

  public loader = new GLTFLoader();

  public geometries = {};

  public materials = {};

  constructor() {
    this.scene.name = "scene";
    this.sceneHelpers.add(new THREE.HemisphereLight(0xffffff, 0x888888, 2));
  }

  public setSence() {}

  public addObject() {}
}
