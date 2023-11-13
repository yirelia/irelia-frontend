import { ComponentInfo } from "./component-info";
import type { Graph } from "@antv/x6";
import type { DiagramComponent } from "../model";
import { GraphDataTagEnum, ShapeLayer, ViewScale, ViewType } from "../enums";
import {
  BitmapAnnotation,
  EllipseAnnotation,
  LineAnnotation,
  PolygonAnnotation,
  RectangleAnnotation,
  TextAnnotation,
} from "../annotations";
import CoOrdinateSystem from "./coordinate-system";

export class Component {
  public componentInfo: ComponentInfo;

  public graph: Graph;

  public parentComponent: Component | null = null;

  public coordinateSystem = new CoOrdinateSystem();

  // 组件类型
  public componentType: ViewType;

  static viewScale = ViewScale;

  public zIndex = ShapeLayer.ComponentZIndex;

  constructor(
    graph: Graph,
    componentInfo: DiagramComponent,
    type = ViewType.Diagram,
    parentComponent?: Component
  ) {
    if (parentComponent) {
      this.parentComponent = parentComponent;
    }
    // 整体坐标是否扩大 5倍适配 web 视图, 父级组件放大后，子组件坐标会跟随变大
    const viewScale = type === ViewType.Diagram ? Component.viewScale : 1;
    this.componentInfo = new ComponentInfo(viewScale, componentInfo);
    this.graph = graph;
    this.componentType = type;
    this.coordinateSystem.updateCoordinateSystem(
      componentInfo.coordinate_system
    );

    this.coordinateSystem.setFlipX(this.componentInfo.flipX);
    this.coordinateSystem.setFlipY(this.componentInfo.flipY);
    const viewSx = this.componentInfo.width / this.coordinateSystem.getWidth();
    const viewSy =
      this.componentInfo.height / this.coordinateSystem.getHeight();
    this.coordinateSystem.setViewScaleX(viewSx);
    this.coordinateSystem.setViewScaleY(viewSy);
  }

  public getMarkUp() {
    const shapeList = [];
    for (const shape of this.componentInfo.getSubShape()) {
      if (shape.type === "Rectangle") {
        shapeList.push(new RectangleAnnotation(this.graph, shape, this));
      } else if (shape.type === "Line") {
        shapeList.push(new LineAnnotation(this.graph, shape, this));
      } else if (shape.type === "Polygon") {
        shapeList.push(new PolygonAnnotation(this.graph, shape, this));
      } else if (shape.type === "Ellipse") {
        shapeList.push(new EllipseAnnotation(this.graph, shape, this));
      } else if (shape.type === "Text") {
        shapeList.push(new TextAnnotation(this.graph, shape, this));
      } else if (shape.type === "Bitmap") {
        shapeList.push(new BitmapAnnotation(this.graph, shape, this));
      }
    }
    return shapeList.map((item) => item.markup());
  }

  public get rawComponentInfo() {
    return this.componentInfo.rawComponentInfo;
  }

  /**
   * @description: 创建 node
   * @return {*}
   */
  public createNode() {
    // 重要 中心点偏移量作为计算位置
    const position = this.getNodePosition();
    const markup = this.getMarkUp();
    const width = this.componentInfo.width;
    const height = this.componentInfo.height;
    const id = this.getComponentId();
    const data = this.getData();
    const node = this.graph.createNode({
      id,
      x: position.x,
      y: position.y,
      width,
      height,
      markup,
      data,
      zIndex: this.zIndex,
    });
    if (this.componentType === ViewType.Icon) {
      const rotation = this.parentComponent?.componentInfo.rotation || 0;
      const center = this.parentComponent?.componentInfo.getViewCenter();
      node.rotate(rotation, { absolute: true, center });
    }
    return node;
  }

  /**
   * @description: 获取节点位置
   * @return {*}
   */
  public getNodePosition() {
    const viewCenter = this.componentInfo.getViewCenter();
    if (this.componentType === ViewType.Diagram) {
      return viewCenter;
    }
    const parentViewSx = this.parentComponent!.coordinateSystem.getViewScaleX();
    const parentViewSY = this.parentComponent!.coordinateSystem.getViewScaleY();
    const parentCenter = this.parentComponent!.componentInfo.getViewCenter();
    const parentFlipX = this.parentComponent!.coordinateSystem.flipX;
    const parentFlipY = this.parentComponent!.coordinateSystem.flipY;
    return {
      x: viewCenter.x * parentViewSx * parentFlipX + parentCenter.x,
      y: viewCenter.y * parentViewSY * parentFlipY + parentCenter.y,
    };
  }

  /**
   * @description: 获取组件ID ，
   * 此处区分root组件 输入输出组件
   * @return {*}
   */
  public getComponentId(): string {
    return this.componentType === ViewType.Diagram
      ? this.componentInfo.name
      : `${this.parentComponent!.componentInfo.name}.${
          this.componentInfo.name
        }`;
  }

  public getData() {
    const tag =
      ViewType.Diagram === this.componentType
        ? GraphDataTagEnum.DiagramComponent
        : GraphDataTagEnum.DiagramInputoutput;
    return {
      tag,
      data: this.rawComponentInfo,
      parent: this.parentComponent?.rawComponentInfo,
    };
  }
}
