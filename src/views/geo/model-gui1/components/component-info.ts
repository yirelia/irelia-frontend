import { ViewScale } from "./../../model-gui/enums/index";
import { DiagramComponent, Point } from "../../model-gui/model";
import { Flip, ModelicaClasses } from "../enums";
import { getBigNumerIntance, toNum, toPoint } from "../utils";
import { ComponentView } from "./view";
const BigNumber = getBigNumerIntance();
export class ComponentInfo {
  public x = 0;
  public y = 0;
  public width = 200;
  public height = 200;
  public originDiagram: Point = {
    x: 0,
    y: 0,
  };
  public extent1Diagram: Point = {
    x: 0,
    y: 0,
  };
  public extent2Diagram: Point = {
    x: 0,
    y: 0,
  };
  public rotation = 0;

  public className = "";

  public name = "";

  public isInner = false;

  public isOuter = false;

  private viewScale = 1;

  public rawComponentInfo!: DiagramComponent;

  public isConnector = false;

  constructor(viewScale = 1, componentInfo?: DiagramComponent) {
    if (componentInfo) {
      this.updateComponentInfo(componentInfo);
    }
    this.viewScale = viewScale;
  }

  public updateComponentInfo(componentInfo: DiagramComponent) {
    this.rawComponentInfo = componentInfo;
    this.extent1Diagram = toPoint(
      componentInfo.extent1Diagram,
      this.viewScale,
      this.viewScale
    );

    this.extent2Diagram = toPoint(
      componentInfo.extent2Diagram,
      this.viewScale,
      this.viewScale
    );

    this.originDiagram = toPoint(componentInfo.originDiagram);
    // 重要坐标系角度转换
    this.rotation = -toNum(componentInfo.rotation);

    this.width = Math.abs(this.extent1Diagram.x - this.extent2Diagram.x);
    this.height = Math.abs(this.extent1Diagram.y - this.extent2Diagram.y);

    this.isConnector =
      componentInfo.graphType === ModelicaClasses.ExpandableConnector ||
      componentInfo.graphType === ModelicaClasses.Connector;
  }

  /**
   * @description: 水平翻转状态
   * @return {*}
   */
  public get flipX(): number {
    return this.extent2Diagram.x < this.extent1Diagram.x
      ? Flip.IsFlip
      : Flip.NoFlip;
  }

  public get flipY(): number {
    return this.extent2Diagram.y > this.extent1Diagram.y
      ? Flip.IsFlip
      : Flip.NoFlip;
  }

  public get center() {
    return {
      x: new BigNumber(this.extent1Diagram.x)
        .plus(this.extent2Diagram.x)
        .div(2)
        .toNumber(),
      y: new BigNumber(this.extent1Diagram.y)
        .plus(this.extent2Diagram.y)
        .div(2)
        .toNumber(),
    };
  }

  public getSubShape() {
    return this.rawComponentInfo.subShapes;
  }
}
