import type { Graph } from '@antv/x6';
import { map } from 'lodash-es';
import { Transformation } from '../components/transformation';
import type { Point } from '../model';
import type {
  DiagramCell,
  LineStyle
} from '@/views/simulation/model/components/graphics/type';
import {
  convertMMToPixel,
  getBigNumerIntance,
  getColorOrPoint,
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
  public rawShape!: DiagramCell;
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
  constructor(graph: Graph, shape: DiagramCell, component?: Component) {
    this.graph = graph;
    this.rawShape = shape;
    if (component) {
      this.component = component;
    }
    this.initShapePoints(this.rawShape);
    this.setArrowType(this.rawShape.arrow);
    this.rotation = -toNum(shape.rotation);
    if (shape.offset) {
      this.originalPoint = toPoint(shape.offset);
    }
    this.stroke = this.getStroke();
    const { lineColor } = this.rawShape;
    this.color = toRgbColor(getColorOrPoint(lineColor as any));
    this.fill = this.getFillColor();
    this.strokeWidth = this.getStrokeWidth();
    this.opacity = this.rawShape.opacity === 0 ? 0 : 1;
    this.magnet = this.rawShape.magnet;
    this.isSmooth = this.rawShape.smooth?.name === 'smooth';
    this.textColor = toRgbColor(this.rawShape.textColor);

    this.textString =
      this.rawShape.textString === '%name'
        ? this.component?.componentInfo.name || ''
        : this.rawShape.textString;
    this.isDiagram = this.rawShape.diagram || false;
    if (this.rawShape.linePattern) {
      this.strokeDasharray = this.getStrokeDashArray(
        this.rawShape.linePattern?.name
      );
    }
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

    return patterns.includes(this.rawShape.fillPattern?.name as FillPattern);
  }

  public initShapePoints(shape: DiagramCell) {
    const points = getColorOrPoint(shape?.extentsPoints as any) || [];
    if (Array.isArray(points)) {
      this.extentPoints = points.map(item => toPoint(item));
    }
  }

  /**
   * @description: 处理箭头类型
   * @param {string} arrow
   * @return {*}
   */
  public setArrowType(arrow: LineStyle[]): void {
    if (arrow) {
      const [startArrow, endArrow] = map(arrow, 'name') as Arrow[];
      this.startArrow = startArrow;
      this.endArrow = endArrow;
    }
  }

  /**
   * @description: 获取线的颜色
   * @return {*}
   */
  private getStroke(): string {
    const { linePattern, lineColor } = this.rawShape;
    if (
      (linePattern && linePattern?.name === 'LinePattern.None') ||
      !lineColor
    ) {
      return 'none';
    }
    return toHexColor(getColorOrPoint(lineColor as any));
  }

  private getStrokeWidth(): number {
    const { borderPattern } = this.rawShape;
    // 规范中没有提到 boderpattern
    // 保持 Dymola 行为一致  border patterns raised & sunken 设置默认线条
    let thickness = toNum(this.rawShape.thickness);
    if (
      borderPattern?.name === BorderPattern.BorderRaised ||
      borderPattern?.name === BorderPattern.BorderSunken
    ) {
      thickness = 0.25;
    }
    return convertMMToPixel(thickness);
  }

  /**
   * @description: 获取渐变色
   * @return {*}
   */
  public getFillColor() {
    const { fillPattern, fillColor, lineColor } = this.rawShape;
    const fill = toHexColor(
      Array.isArray(fillColor)
        ? fillColor
        : (fillColor?.arguments[0] ?? [0, 0, 0])
    );
    const gradientColor = toHexColor(
      Array.isArray(lineColor)
        ? lineColor
        : (lineColor?.arguments[0] ?? [0, 0, 0])
    );
    const graph = this.graph;
    let gradientId = '';
    if (!fillPattern) return;
    switch (fillPattern.name) {
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
        return `url(#${this.getFillPatternId(
          fillPattern?.name,
          gradientColor
        )})`;
      case FillPattern.None:
        return `transparent`;
      // never reach
      default:
        return fill;
    }
  }

  /**
   * @description: 获取fillPattern ID
   * @param {string} linePattern
   * @return {*}
   */
  private getFillPatternId(linePattern: string, fillColor: string) {
    return definePattern(
      this.graph,
      linePattern,
      `${linePattern}.${fillColor}`,
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
    if (!leftBottomPoint || !rightTopPoint) {
      console.log('没有坐标');
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
    }
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
