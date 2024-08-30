import type { Graph } from '@antv/x6';
import { Transformation } from '../components/transformation';
import type { DiagramShape, Point } from '../model';
import {
  convertMMToPixel,
  getBigNumerIntance,
  toHexColor,
  toNum,
  toPoint,
  toRgbColor
} from '../utils';
import type { Component } from '../components/component';
import {
  Arrow,
  BorderPattern,
  FillPattern,
  LinePattern,
  ViewScale,
  ViewType
} from '../enums';
import { definePattern } from '../pattern';

const BigNumber = getBigNumerIntance();
export default abstract class ShapeAnnotation {
  // 方法需要使用
  public rawShape!: DiagramShape;
  public stroke = `#000000`;
  public color = `#000000`;
  public strokeWidth = 0.25;
  public strokeDasharray = '0';
  // 是否为平滑曲线
  public isSmooth = false;
  public radius = 0;
  public rotation = 0;
  // svg 中fill 包含了 pattern,&& gradient
  public fill = `#000000`;
  public extents = [];
  public startAngle = 0;
  public endAngle = 360;
  public originalTextString = '';
  public textString = '';
  public fontSize = 12;
  public fontName = '';
  public tag = '';
  public graph!: Graph;
  public transformation!: Transformation;
  public originalPoint = {
    x: 0,
    y: 0
  };
  public component: Component | undefined;
  public extentPoints: Point[] = [];
  public opacity = 1;
  public magnet = false;

  public hasOriginPointX = true;

  public hasOriginPointY = true;

  // 是否为注释图形
  public isDiagram = false;
  //
  public xlinkHref = '';

  // 箭头类型
  public arrowType = '';
  // 开始箭头
  public startArrow = Arrow.None;
  // 结束箭头
  public endArrow = Arrow.None;

  public textColor = `rgb(0, 0, 0)`;

  // 默认的缩放比例
  public viewScale = ViewScale;
  constructor(graph: Graph, shape: DiagramShape, component?: Component) {
    this.graph = graph;
    this.rawShape = shape;
    if (component) {
      this.component = component;
    }
    this.initShapePoints(this.rawShape);
    this.setArrowType(this.rawShape.arrow);
    this.rotation = -toNum(shape.rotation);
    this.originalPoint = toPoint(shape.originalPoint);
    this.stroke = this.getStroke();
    this.color = toRgbColor(this.rawShape.color);
    this.fill = this.getFillColor();
    this.strokeWidth = this.getStrokeWidth();
    this.opacity = this.rawShape.opacity === 0 ? 0 : 1;
    this.magnet = this.rawShape.magnet;
    this.isSmooth = this.rawShape.smooth === 'smooth';
    this.textColor = toRgbColor(this.rawShape.textColor);

    this.originalTextString =
      this.rawShape.originalTextString === '%name'
        ? this.component?.componentInfo.name || ''
        : this.rawShape.originalTextString;
    this.isDiagram = this.rawShape.diagram || false;
    this.strokeDasharray = this.getStrokeDashArray(this.rawShape.linePattern);
    if (this.rawShape.imageBase64) {
      this.xlinkHref = `data:image/png;base64,${this.rawShape.imageBase64}`;
    }
    this.transformation = new Transformation(this, this.component);
  }

  /**
   * @description: 判断图形是否需要 pattern遮盖
   * @param {string} pattern
   * @return {*}
   */
  public get hasFillPattern(): boolean {
    const patterns = [
      FillPattern.Backward,
      FillPattern.Forward,
      FillPattern.Horizontal,
      FillPattern.Vertical,
      FillPattern.Vertical,
      FillPattern.Cross,
      FillPattern.CrossDiag
    ];

    return patterns.includes(this.rawShape.fillPattern as FillPattern);
  }

  public initShapePoints(shape: DiagramShape) {
    let points: string[] = [];
    if (shape.type === 'Rectangle') {
      points = shape.extentsPoints;
    } else if (shape.type === 'Line') {
      points = shape.points;
    } else if (shape.type === 'Polygon') {
      points = shape.polygonPoints;
    } else if (shape.type === 'Ellipse') {
      points = shape.extentsPoints;
    } else if (shape.type === 'Text') {
      points = shape.extentsPoints;
    } else if (shape.type === 'Bitmap') {
      points = shape.points;
    }
    this.extentPoints = points.map(item => toPoint(item));
  }

  /**
   * @description: 处理箭头类型
   * @param {string} arrow
   * @return {*}
   */
  public setArrowType(arrow: string): void {
    if (arrow) {
      const [startArrow, endArrow] = arrow.split(',') as Arrow[];
      this.startArrow = startArrow;
      this.endArrow = endArrow;
    }
  }

  /**
   * @description: 获取线的颜色
   * @return {*}
   */
  private getStroke(): string {
    const { linePattern, color } = this.rawShape;
    if (linePattern === 'LinePattern.None' || !color) {
      return 'none';
    }
    return toHexColor(color);
  }

  private getStrokeWidth(): number {
    const { borderPattern } = this.rawShape;
    // 规范中没有提到 boderpattern
    // 保持 Dymola 行为一致  border patterns raised & sunken 设置默认线条
    let lineThickness = toNum(this.rawShape.lineThickness);
    if (
      borderPattern === BorderPattern.BorderRaised ||
      borderPattern === BorderPattern.BorderSunken
    ) {
      lineThickness = 0.25;
    }
    return convertMMToPixel(lineThickness);
  }

  /**
   * @description: 获取渐变色
   * @return {*}
   */
  public getFillColor() {
    const { fillPattern, color, fillColor } = this.rawShape;
    const fill = toHexColor(fillColor || '0,0,0');
    const gradientColor = toHexColor(color || '0,0,0');
    const graph = this.graph;
    let gradientId = '';
    switch (fillPattern) {
      case FillPattern.Sphere:
        gradientId = graph.defineGradient({
          type: 'radialGradient',
          stops: [
            { offset: 0, color: fill, opacity: 1 },
            { offset: 100, color: gradientColor, opacity: 1 }
          ],
          attrs: {
            cx: 0.5,
            cy: 0.5,
            fx: 0.5,
            fy: 0.5
          }
        });
        return `url(#${gradientId})`;
      case FillPattern.VerticalCylinder:
        gradientId = graph.defineGradient({
          type: 'linearGradient',
          stops: [
            { offset: 0, color: gradientColor, opacity: 1 },
            { offset: 0.5, color: fill, opacity: 1 },
            { offset: 100, color: gradientColor, opacity: 1 }
          ],
          attrs: {
            x1: 0,
            x2: 1,
            y1: 0,
            y2: 0
          }
        });
        return `url(#${gradientId})`;
      case FillPattern.HorizontalCylinder:
        gradientId = graph.defineGradient({
          type: 'linearGradient',
          stops: [
            { offset: 0, color: gradientColor, opacity: 1 },
            { offset: 0.5, color: fill, opacity: 1 },
            { offset: 100, color: gradientColor, opacity: 1 }
          ],
          attrs: {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 1
          }
        });
        return `url(#${gradientId})`;
      case FillPattern.Backward:
      case FillPattern.Forward:
      case FillPattern.Horizontal:
      case FillPattern.Vertical:
      case FillPattern.Cross:
      case FillPattern.CrossDiag:
        return `url(#${this.getFillPatternId(fillPattern, gradientColor)})`;
      case FillPattern.None:
        return `transparent`;
      // never reach
      default:
        return fill;
    }
  }

  /**
   * @description: 获取fillPattern ID
   * @param {string} fillPattern
   * @return {*}
   */
  private getFillPatternId(fillPattern: string, fillColor: string) {
    return definePattern(
      this.graph,
      fillPattern,
      `${fillPattern}.${fillColor}`,
      fillColor
    );
  }

  public getPathPoint(): Point[] {
    if (this.isDiagram) {
      return this.getDiagramViewPoints();
    } else {
      if (this.component?.componentType === ViewType.Diagram) {
        return this.getDiagramPoints();
      }
      return this.getIconPoints();
    }
  }

  public getDiagramViewPoints() {
    const scalePints = this.scalePoints(
      this.extentPoints,
      ViewScale,
      ViewScale
    );
    // 处理偏移量坐标
    const { x: tx, y: ty } = {
      x: new BigNumber(this.originalPoint.x).multipliedBy(ViewScale).toNumber(),
      y: new BigNumber(this.originalPoint.y).multipliedBy(ViewScale).toNumber()
    };
    return this.translatePoints(scalePints, tx, ty);
  }

  public setMagnet(magnet: boolean) {
    this.magnet = magnet;
  }

  public scalePoints(points: Point[], sx: number, sy: number) {
    return points.map(point => {
      return {
        x: new BigNumber(point.x).multipliedBy(sx).toNumber(),
        y: new BigNumber(point.y).multipliedBy(sy).toNumber()
      };
    });
  }

  public translatePoints(points: Point[], tx: number, ty: number) {
    return points.map(point => {
      return {
        x: new BigNumber(point.x).plus(tx).toNumber(),
        y: new BigNumber(point.y).plus(ty).toNumber()
      };
    });
  }

  /**
   * @description: 添加视图坐标点
   * @return {*}
   */
  public getDiagramPoints(): Point[] {
    const viewScaleX = this.component!.coordinateSystem.getViewScaleX();
    const viewScaleY = this.component!.coordinateSystem.getViewScaleY();
    const { x: shapeOriginX, y: shapeOriginY } = this.originalPoint;
    // 缩放坐标
    const scaledOriginPoint = {
      x: new BigNumber(shapeOriginX).multipliedBy(viewScaleX).toNumber(),
      y: new BigNumber(shapeOriginY).multipliedBy(viewScaleY).toNumber()
    };
    let viewPoints: Point[] = [];
    viewPoints = this.scalePoints(this.extentPoints, viewScaleX, viewScaleY);
    viewPoints = this.translatePoints(
      viewPoints,
      scaledOriginPoint.x,
      scaledOriginPoint.y
    );
    return viewPoints;
  }

  /**
   * @description: 获取输入输出框的Points
   * @return {*}
   */
  public getIconPoints(): Point[] {
    const viewScaleX = this.component!.coordinateSystem.getViewScaleX();
    const viewScaleY = this.component!.coordinateSystem.getViewScaleY();
    const parentViewScaleX =
      this.component!.parentComponent!.coordinateSystem.getViewScaleX();
    const parentViewScaleY =
      this.component!.parentComponent!.coordinateSystem.getViewScaleY();
    const parentFlipX = this.component!.parentComponent!.coordinateSystem.flipX;
    const parentFlipY = this.component!.parentComponent!.coordinateSystem.flipY;
    const { x: shapeOriginX, y: shapeOriginY } = this.originalPoint;

    const sx = viewScaleX * parentViewScaleX * parentFlipX;
    const sy = viewScaleY * parentViewScaleY * parentFlipY;
    const scaledOriginPoint = {
      x: new BigNumber(shapeOriginX).multipliedBy(sx).toNumber(),
      y: new BigNumber(shapeOriginY).multipliedBy(sy).toNumber()
    };
    let viewPoints: Point[] = [];
    viewPoints = this.scalePoints(this.extentPoints, sx, sy);
    viewPoints = this.translatePoints(
      viewPoints,
      scaledOriginPoint.x,
      scaledOriginPoint.y
    );
    return viewPoints;
  }

  /**
   * @description:
   * @param {Point} p1
   * @param {Point} p2
   * @return {*}
   */
  public getBox(leftBottomPoint: Point, rightTopPoint: Point) {
    const width = Math.abs(leftBottomPoint.x - rightTopPoint.x);
    const height = Math.abs(leftBottomPoint.y - rightTopPoint.y);
    const center = this.center(leftBottomPoint, rightTopPoint);
    return {
      x: center.x - width / 2,
      y: center.y - height / 2,
      width,
      height
    };
  }

  /**
   * @description: 获取盒子中心点
   * @param {Point} p1
   * @param {Point} p2
   * @return {*}
   */
  public center(p1: Point, p2: Point) {
    const x = new BigNumber(p1.x).plus(p2.x).div(2).toNumber();
    const y = new BigNumber(p1.y).plus(p2.y).div(2).toNumber();
    return {
      x,
      y
    };
  }

  public hasOriginPoint() {
    return this.originalPoint.x || this.originalPoint.y;
  }

  /**
   * @description: 获取图形在画布视图上的中心店
   * @return {*}
   */
  public getViewOriginPoint(): Point {
    const viewScaleX = this.component!.coordinateSystem.getViewScaleX();
    const viewScaleY = this.component!.coordinateSystem.getViewScaleY();
    const { x: shapeOriginX, y: shapeOriginY } = this.originalPoint;
    return {
      x: new BigNumber(shapeOriginX).multipliedBy(viewScaleX).toNumber(),
      y: new BigNumber(shapeOriginY).multipliedBy(viewScaleY).toNumber()
    };
  }

  /**
   * @description: 获取线段patter
   * @param {string} linePattern
   * @return {*}
   */
  public getStrokeDashArray(linePattern: string): string {
    switch (linePattern) {
      case LinePattern.Solid:
      case LinePattern.None:
        return '0';
      case LinePattern.Dash:
      case LinePattern.DashDot:
      case LinePattern.DashDotDot:
      case LinePattern.Dot:
        return '5';
      default:
        // never reached
        return '0';
    }
  }
}
