import { Editor } from "./editor";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/addons/loaders/KTX2Loader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";

export class Loader {
  constructor(editor?: Editor) {}
  // 后续扩展其他loader 加载器
  public createGLTFLoader(manager?: any) {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("three/examples/jsm/libs/draco/");
    const loader = new GLTFLoader(manager);
    loader.setDRACOLoader(dracoLoader);
    loader.setMeshoptDecoder(MeshoptDecoder);
    return loader;
  }
}
