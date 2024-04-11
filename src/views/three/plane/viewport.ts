import { Loader } from "./loader";
import type { WebGLRenderer } from "three";
import { Editor } from "./editor";
import THREE from "three";

export class ViewPort {
  public renderer: WebGLRenderer;
  public editor: Editor;
  public container!: HTMLDivElement;

  constructor(container: HTMLDivElement) {
    this.editor = new Editor();
    this.container = container;
    this.renderer = this.createRender();
  }

  public createRender() {
    const currentRenderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    currentRenderer.shadowMap.enabled = true;
    currentRenderer.shadowMap.type = 1;
    currentRenderer.toneMapping = 0;
    currentRenderer.toneMappingExposure = 1;

    currentRenderer.setClearColor(0xaaaaaa);
    currentRenderer.setPixelRatio(window.devicePixelRatio);
    const { offsetWidth, offsetHeight } = this.container;
    currentRenderer.setSize(offsetWidth, offsetHeight);
    return currentRenderer;
  }

  public load() {
    this.editor.loader.load("");
  }
}
