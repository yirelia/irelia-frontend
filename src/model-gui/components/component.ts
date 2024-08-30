import { ComponentInfo } from './component-info';
import type { Graph, Markup } from '@antv/x6';
import type {
  DiagramCell,
  GraphCell
} from '@/views/simulation/model/components/graphics/type';
import { GraphDataTagEnum, ShapeLayer, ViewScale, ViewType } from '../enums';
import {
  BitmapAnnotation,
  EllipseAnnotation,
  LineAnnotation,
  PolygonAnnotation,
  RectangleAnnotation,
  TextAnnotation
} from '../annotations';
import CoOrdinateSystem from './coordinate-system';

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
    componentInfo: GraphCell,
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
      componentInfo.coordinateSystem
    );

    this.coordinateSystem.setFlipX(this.componentInfo.flipX);
    this.coordinateSystem.setFlipY(this.componentInfo.flipY);
    const viewSx = this.componentInfo.width / this.coordinateSystem.getWidth();
    const viewSy =
      this.componentInfo.height / this.coordinateSystem.getHeight();
    this.coordinateSystem.setViewScaleX(viewSx);
    this.coordinateSystem.setViewScaleY(viewSy);
  }

  public getMarkUp(): Markup {
    const shapeList = [];
    let subShapes: DiagramCell[] = [];
    if (
      (this.componentType === ViewType.Diagram &&
        this.componentInfo.rawComponentInfo.restriction === 'block') ||
      this.componentInfo.rawComponentInfo.restriction === 'model'
    ) {
      subShapes = this.componentInfo.getSubShapeNoCenter();
    } else {
      subShapes = this.componentInfo.getSubShape() as DiagramCell[];
    }
    for (const shape of subShapes) {
      if (shape.type === 'Rectangle') {
        shapeList.push(new RectangleAnnotation(this.graph, shape, this));
      } else if (shape.type === 'Line') {
        shapeList.push(new LineAnnotation(this.graph, shape, this));
      } else if (shape.type === 'Polygon') {
        shapeList.push(new PolygonAnnotation(this.graph, shape, this));
      } else if (shape.type === 'Ellipse') {
        shapeList.push(new EllipseAnnotation(this.graph, shape, this));
      } else if (shape.type === 'Text') {
        shapeList.push(new TextAnnotation(this.graph, shape, this));
      } else if (shape.type === 'Bitmap') {
        shapeList.push(new BitmapAnnotation(this.graph, shape, this));
      }
    }
    return (
      shapeList
        // .map(item => item.markup())
        .reduce((markups: any[], item) => {
          /*
           * 兼容特殊场景处理
           * FillPattern 为 pattern类型的特殊处理
           */
          const markup = item.markup() as any[];
          if (Array.isArray(markup)) {
            markups.push(...markup);
          } else {
            markups.push(markup);
          }
          return markups;
        }, []) as unknown as Markup
    );
  }

  public get rawComponentInfo() {
    return this.componentInfo.rawComponentInfo;
  }
  // 定义四个角标的尺寸
  cornerSize = 8;

  // 定义四个角标的markup
  public getCornerMarkup(width: number, height: number): any[] {
    const initCoordinateSystem = this.componentInfo?.rawComponentInfo
      ?.coordinateSystem?.extent || [
      [-100, -100],
      [100, 100]
    ];
    const [start, end] = initCoordinateSystem;
    const x = (start[0] + end[0]) / 4;
    const y = (start[1] + end[1]) / 4;
    return [
      {
        tagName: 'rect',
        selector: 'top-left-corner',
        groupSelector: 'node-corner',
        attrs: {
          width: this.cornerSize,
          height: this.cornerSize,
          x: x - (width + this.cornerSize) / 2,
          y: y - (height + this.cornerSize) / 2
        }
      },
      {
        tagName: 'rect',
        selector: 'top-right-corner',
        groupSelector: 'node-corner',
        attrs: {
          width: this.cornerSize,
          height: this.cornerSize,
          x: x - (width + this.cornerSize) / 2 + width,
          y: y - (height + this.cornerSize) / 2
        }
      },
      {
        tagName: 'rect',
        selector: 'bottom-left-corner',
        groupSelector: 'node-corner',
        attrs: {
          width: this.cornerSize,
          height: this.cornerSize,
          x: x - (width + this.cornerSize) / 2,
          y: y - (height + this.cornerSize) / 2 + height
        }
      },
      {
        tagName: 'rect',
        selector: 'bottom-right-corner',
        groupSelector: 'node-corner',
        attrs: {
          width: this.cornerSize,
          height: this.cornerSize,
          x: x - (width + this.cornerSize) / 2 + width,
          y: y - (height + this.cornerSize) / 2 + height
        }
      }
    ];
  }

  /**
   * @description: 创建 node
   * @return {*}
   */
  public createNode() {
    // 重要 中心点偏移量作为计算位置
    const position = this.getNodePosition();
    const { width, height } = this.componentInfo;
    const markup = this.getMarkUp() as any[];
    const id = this.getComponentId();
    const data = this.getData();
    // 有markup障碍物边界显示不对
    const item = {
      id,
      x: position.x,
      y: position.y,
      width,
      height,
      markup,
      data,
      zIndex: this.zIndex,
      attrs: {
        'node-corner': {
          fill: 'transparent',
          stroke: 'transparent'
        }
      }
    };
    if (this.componentType === ViewType.Diagram) {
      item.markup.push(...this.getCornerMarkup(width, height));
    }
    const node = this.graph.createNode(item);
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
      y: viewCenter.y * parentViewSY * parentFlipY + parentCenter.y
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
      parent: this.parentComponent?.rawComponentInfo
    };
  }
}
