import type { Graph } from '@antv/x6';
import type { DiagramComponent } from '../model';
import { Point } from '../model';
import {
  Flip,
  GraphDataTagEnum,
  ModelicaClasses,
  ShapeLayer,
  ViewScale,
  ViewType
} from '../enums';
import { toNum, toPoint } from '../utils';
import {
  BitmapAnnotation,
  EllipseAnnotation,
  LineAnnotation,
  PolygonAnnotation,
  RectangleAnnotation,
  TextAnnotation,
  makeDefaultRectangle
} from '../annotations';
import CoOrdinateSystem from './co-ordinate-system';

export class Component {
  public componentInfo: DiagramComponent;
  public graph: Graph;

  public width = 200; // 默认宽
  public height = 200; // 默认高

  public x = -100; // 默认的左上角x 轴位置
  public y = -100; // 默认的左上角 y 轴位置

  public parent: Component; // 父级组件

  public coOrdinateSystem = new CoOrdinateSystem();

  // 绘图视图中的实际左下角的坐标
  public extent1Diagram = {
    x: -100,
    y: 100
  };

  // 绘图视图中的实际右上角的坐标
  public extent2Diagram = {
    x: 100,
    y: -100
  };

  // 绘图视图中的偏移量坐标
  public originDiagram = {
    x: 0,
    y: 0
  };

  // 盒子图形的中心点
  public center = {
    x: 0,
    y: 0
  };

  // 旋转角度
  public rotation = 0;

  // 组件类型
  public componentType: ViewType;

  static viewScale = ViewScale;

  public zIndex = ShapeLayer.ComponentZIndex;

  constructor(
    graph: Graph,
    component: DiagramComponent,
    type = ViewType.Diagram,
    parent = null
  ) {
    this.parent = parent;
    this.componentInfo = component;
    this.graph = graph;
    this.componentType = type;
    const viewScale = type === ViewType.Diagram ? Component.viewScale : 1;
    const extent1Diagram = (this.extent1Diagram = toPoint(
      component.extent1Diagram,
      viewScale,
      viewScale
    ));
    const extent2Diagram = (this.extent2Diagram = toPoint(
      component.extent2Diagram,
      viewScale,
      viewScale
    ));
    this.originDiagram = toPoint(component.originDiagram, viewScale, viewScale);
    this.width = Math.abs(extent1Diagram.x - extent2Diagram.x);
    this.height = Math.abs(extent1Diagram.y - extent2Diagram.y);
    const extent1 = component.coordinate_system.extent1_diagram.map(item =>
      toNum(item)
    );
    const extent2 = component.coordinate_system.extent2_diagram.map(item =>
      toNum(item)
    );
    // get the horizontal flip
    const flipX =
      extent2Diagram.x < extent1Diagram.x ? Flip.IsFlip : Flip.NoFlip;
    // get the vertical flip
    const flipY = extent2Diagram.y > extent1Diagram.y ? -1 : 1;
    const coOrdinateSystemPoints = [
      new Point(extent1[0], extent1[1]),
      new Point(extent2[0], extent2[1])
    ];
    this.coOrdinateSystem.setInitialScale(
      component.coordinate_system.initial_scale
    );
    this.coOrdinateSystem.setExtent(coOrdinateSystemPoints);
    this.coOrdinateSystem.setPreserveAspectRatio(
      component.coordinate_system.preserve_aspect_ratio
    );
    this.coOrdinateSystem.setFlipX(flipX);
    this.coOrdinateSystem.setFlipY(flipY);
    const viewSx = this.width / this.coOrdinateSystem.getWidth();
    const viewSy = this.height / this.coOrdinateSystem.getHeight();
    this.coOrdinateSystem.setViewScaleX(viewSx);
    this.coOrdinateSystem.setViewScaleY(viewSy);
    this.center.x = (extent1Diagram.x + extent2Diagram.x) / 2;
    this.center.y = (extent1Diagram.y + extent2Diagram.y) / 2;
    this.x =
      Math.min(extent1Diagram.x, extent2Diagram.x) + this.originDiagram.x;
    this.y =
      Math.min(extent1Diagram.y, extent2Diagram.y) + this.originDiagram.y;
    this.rotation = -toNum(component.rotation);
    this.componentInfo.subShapes = this.componentInfo.subShapes.map(shape => {
      shape.opacity = 1;
      return shape;
    });
    // ticket 先添加一个边界矩形占位
    this.addBoundingRect();
    const magnet = this.isConnector();
    if (magnet) {
      if (this.componentType === ViewType.Icon) {
        this.addBoundingRect(true);
      } else {
        this.addComponetConectorRect();
      }
    }
  }

  /**
   * @description: 添加图形的边界块
   * @param {*} magnet 是否未链接桩
   * @return {*}
   */
  public addBoundingRect(magnet = false, isIcon = true): void {
    const defaultExtent1Diagram =
      this.componentInfo.coordinate_system.extent1_diagram;
    const defaultExtent2Diagram =
      this.componentInfo.coordinate_system.extent2_diagram;
    const extentsPoints = [
      `${defaultExtent1Diagram[0]},${defaultExtent1Diagram[1]}`,
      `${defaultExtent2Diagram[0]},${defaultExtent2Diagram[1]}`
    ];
    const reactangle = makeDefaultRectangle({
      extentsPoints,
      magnet,
      opacity: 0
    }) as any;
    if (isIcon) {
      this.componentInfo.subShapes.push(reactangle);
    } else {
      this.componentInfo.subShapes.unshift(reactangle);
    }
  }

  /**
   * @description: Diagram 图形本身为链接装的场景，将链接桩缩小处理
   * @return {*}
   */
  public addComponetConectorRect(sx = 0.5, sy = 0.2): void {
    const magnet = true;
    const { x: cx, y: cy } = this.center;
    const width = this.width * sx;
    const height = this.height * sy;
    const extentsPoints = [
      `${cx - width / 2},${cy - height / 2}`,
      `${cx + width / 2},${cy + height / 2}`
    ];
    const reactangle = makeDefaultRectangle({
      extentsPoints,
      magnet,
      opacity: 0
    }) as any;
    this.componentInfo.subShapes.push(reactangle);
  }

  public getMarkUp() {
    const shapeList = [];
    for (const shape of this.componentInfo.subShapes) {
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
    return shapeList.map(item => item.markup());
  }

  /**
   * @description: 创建 node
   * @return {*}
   */
  public createNode() {
    const markup = this.getMarkUp();
    // 过滤掉用户自定义的占位符
    this.componentInfo.subShapes = this.componentInfo.subShapes.filter(
      shape => !shape.isCustom
    );
    const width =
      this.componentType === ViewType.Diagram ? this.width : this.parent.width;
    const height =
      this.componentType === ViewType.Diagram
        ? this.height
        : this.parent.height;
    const parent = this.parent ? this.parent.componentInfo.name : '';
    const id = this.getComponentId();
    const data = this.getData();
    return this.graph.createNode({
      id,
      width,
      height,
      markup,
      parent,
      data,
      zIndex: this.zIndex
    });
  }

  /**
   * @description: 获取组件ID ，
   * 此处区分root组件 输入输出组件
   * @return {*}
   */
  public getComponentId(): string {
    return this.componentType === ViewType.Diagram
      ? this.componentInfo.name
      : `${this.parent.componentInfo.name}.${this.componentInfo.name}`;
  }

  /**
   * @description: 是否为连接器
   * @return {*}
   */
  public isConnector(): boolean {
    return (
      this.componentInfo.graphType === ModelicaClasses.ExpandableConnector ||
      this.componentInfo.graphType === ModelicaClasses.Connector
    );
  }

  public getData() {
    const tag =
      ViewType.Diagram === this.componentType
        ? GraphDataTagEnum.DiagramComponent
        : GraphDataTagEnum.DiagramInputoutput;
    return {
      tag,
      data: this.componentInfo,
      parent: this.parent?.componentInfo
    };
  }
}
