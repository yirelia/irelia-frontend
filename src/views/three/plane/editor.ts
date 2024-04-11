import * as THREE from "three";
import mitt from "mitt";
import type { Camera, Scene, Material, WebGLRenderer } from "three";
import { Loader } from "./loader";

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

  public viewportCamera!: Camera;

  public viewportShading = "default";

  public loader = new Loader(this).createGLTFLoader();

  // 几何图形
  public geometries: Record<string, THREE.BoxGeometry> = {};

  // 材质对象
  public materials: Record<string, Material> = {};

  // 对象列表
  public object: Record<string, any> = {};

  // 纹理对象
  public textures: Record<string, THREE.Texture> = {};

  // 相机列表
  public cameras: Record<string, Camera> = {};

  public renderer: WebGLRenderer;

  public editor: Editor;

  public container: HTMLDivElement;

  constructor() {
    this.scene.name = "scene";
    this.sceneHelpers.add(new THREE.HemisphereLight(0xffffff, 0x888888, 2));
    this.viewportCamera = this.camera;
  }

  public initSceneName() {}

  public setSence(scene: Scene) {
    this.scene.uuid = scene.uuid;
    this.scene.name = scene.name;

    this.scene.background = scene.background;
    this.scene.environment = scene.environment;
    this.scene.fog = scene.fog;
    this.scene.backgroundBlurriness = scene.backgroundBlurriness;
    this.scene.backgroundIntensity = scene.backgroundIntensity;

    this.scene.userData = JSON.parse(JSON.stringify(scene.userData));
  }

  public addObject(
    object: THREE.Object3D,
    parent?: THREE.Object3D,
    index?: number
  ) {
    const scope = this;
    object.traverse((child: any) => {
      if (child.geometry !== undefined) {
        scope.geometries[child.geometry.uuid] = child.geometry;
      }
      if (child.material !== undefined) {
        scope.materials[child.material.uuid] = child.material;
      }
      if (parent === undefined) {
        this.scene.add(object);
      } else {
        parent.children.splice(index!, 0, object);
        object.parent = parent;
      }
    });
  }

  public addCamera(camera: Camera) {
    if (camera.isCamera) {
      this.camera;
      this.cameras[camera.uuid] = camera;
    }
  }

  public removeCamera(camera: Camera) {
    if (this.cameras[camera.uuid] !== undefined) {
      delete this.cameras[camera.uuid];
    }
  }
}
