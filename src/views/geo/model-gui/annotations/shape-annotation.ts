import type { Graph } from '@antv/x6';
import type { Transformation } from '../component/transformation';
import type { DiagramShape, Point } from '../model';
import { convertMMToPixel, toNum, toPoint } from '../utils';
import type { Component } from '../component/component';
import { FillPattern, ViewType } from '../enums';
import BigNumber from 'bignumber.js';

export default abstract class ShapeAnnotation {
  public lineColor = 'rgb(0, 0, 0)';
  public linePattern = 'LineSolid';
  public lineThickness = 0.25;
  public smooth = 'smooth';
  public extents = [
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ];
  public borderPattern = 'None';
  public radius = 0;
  public startAngle = 0;
  public endAngle = 360;
  public originalTextString = '';
  public textString = '';
  public fontSize = 0;
  public fontName = '';

  public fill = 'none';
  // 绘制颜色
  public stroke = 'none';
  // 旋转角度
  public rotation = 0;

  public tag = '';

  // 方法需要使用
  public shape: DiagramShape;
  public graph: Graph;

  public transformation: Transformation;

  public originalPoint = {
    x: 0,
    y: 0
  };

  public magnet = false;

  public component: Component | null;

  public extentPoints: Point[] = [];

  constructor(graph: Graph, shape: DiagramShape, component: Component | null) {
    this.shape = shape;
    this.graph = graph;
    this.component = component;
    this.rotation = toNum(shape.rotation);
    this.originalPoint = toPoint(shape.originalPoint);
    this.lineColor = this.getLineColor();
    this.lineThickness = this.getLineThickness();
    this.fill = this.getFillColor();
    this.initShapePoints(shape);
  }

  public initShapePoints(shape: DiagramShape) {
    let points = [];
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
   * @description: 获取rgb颜色
   * @param {string} color
   * @return {*}
   */
  public getRgbColor(color: string) {
    return `rgb(${color})`;
  }

  /**
   * @description: 获取线的颜色
   * @return {*}
   */
  public getLineColor() {
    const { linePattern, color } = this.shape;
    if (linePattern === 'LinePattern.None') {
      return 'none';
    }
    return this.getRgbColor(color);
  }

  public getLineThickness() {
    /* Ticket #4490
     * The specification doesn't say anything about it.
     * But just to keep this consist with Dymola set a default line thickness for border patterns raised & sunken.
     * We need better handling of border patterns.
     */
    // if (mBorderPattern == StringHandler::BorderRaised || mBorderPattern == StringHandler::BorderSunken) {
    //   thickness = Utilities::convertMMToPixel(0.25);
    // }
    const lineThickness = toNum(this.shape.lineThickness) || 0.25;
    return convertMMToPixel(lineThickness);
  }

  /**
   * @description: 获取渐变色
   * @return {*}
   */
  public getFillColor() {
    const { fillPattern, color, fillColor } = this.shape;
    const fill = this.getRgbColor(fillColor);
    const gradientColor = this.getRgbColor(color);
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
        return this.getFillPatternId(FillPattern.Backward);
      case FillPattern.Forward:
        return this.getFillPatternId(FillPattern.Forward);
      case FillPattern.Horizontal:
        return this.getFillPatternId(FillPattern.Horizontal);
      case FillPattern.Vertical:
        return this.getFillPatternId(FillPattern.Vertical);
      case FillPattern.Cross:
        return this.getFillPatternId(FillPattern.Cross);
      case FillPattern.CrossDiag:
        return this.getFillPatternId(FillPattern.CrossDiag);
      case FillPattern.None:
        return `transparent`;
      default:
        return fill;
    }
  }

  /**
   * @description: 获取fillPattern ID
   * @param {string} fillPattern
   * @return {*}
   */
  private getFillPatternId(fillPattern: string) {
    return `url(#${fillPattern}.pattern)`;
  }

  public getPathPoint(): Point[] {
    if (this.component.componentType === ViewType.Diagram) {
      return this.getDiagramPoints();
    }
    return this.getIconPoints();
  }

  public setMagnet(magnet: boolean) {
    this.magnet = magnet;
  }

  public scalePoints(points: Point[], sx: number, sy: number) {
    return points.map(point => {
      return {
        x: point.x * sx,
        y: point.y * sy
      };
    });
  }

  public translatePoints(points: Point[], tx: number, ty: number) {
    return points.map(point => {
      return {
        x: point.x + tx,
        y: point.y + ty
      };
    });
  }

  /**
   * @description: 添加视图坐标点
   * @return {*}
   */
  public getDiagramPoints(): Point[] {
    const sx = this.component.coOrdinateSystem.getViewScaleX();
    const sy = this.component.coOrdinateSystem.getViewScaleY();
    const { x: cx, y: cy } = this.component.center;
    const { x: tx, y: ty } = this.component.originDiagram;
    const { x: stx, y: sty } = this.originalPoint;
    const scalePoints = this.scalePoints(this.extentPoints, sx, sy);
    let translatePoints = this.translatePoints(scalePoints, cx, cy);
    translatePoints = this.translatePoints(translatePoints, tx, ty);
    console.log(`comptent cx: ${cx} cy: ${cy} tx: ${stx} ty ${sty}`)
    this.originalPoint = {
      x: stx * sx + cx + tx,
      y: sty * sy + cy + ty
    }
    if(this.extentPoints[0].x < this.extentPoints[0].x) {
      console.log('fanzhuan')
    }
    console.log(`originPoint x: ${this.originalPoint.x}  y: ${this.originalPoint.y}`)


    translatePoints = this.translatePoints(translatePoints, stx * sx, sty * sy);
    return translatePoints;
  }

  /**
   * @description: 获取输入输出框的Points
   * @return {*}
   */
  public getIconPoints(): Point[] {
    const sx = this.component.coOrdinateSystem.getViewScaleX();
    const sy = this.component.coOrdinateSystem.getViewScaleY();
    // 父组件缩放因子
    const parentSx = this.component.parent.coOrdinateSystem.getViewScaleX();
    const parentsy = this.component.parent.coOrdinateSystem.getViewScaleY();
    const pFlipX = this.component.parent.coOrdinateSystem.flipX;
    const pFlipY = this.component.parent.coOrdinateSystem.flipY;
    const { x: pcx, y: pcy } = this.component.parent.center;
    const { x: ptx, y: pty } = this.component.parent.originDiagram;
    // 自己缩放适合的icon 尺寸，

    const { x: cx, y: cy } = this.component.center;
    const { x: tx, y: ty } = this.component.originDiagram;
    const { x: stx, y: sty } = this.originalPoint;

    let iconPoints = this.scalePoints(
      this.extentPoints,
      sx * pFlipX,
      sy * pFlipY
    );
    iconPoints = this.translatePoints(iconPoints, cx * pFlipX, cy * pFlipY);
    iconPoints = this.translatePoints(iconPoints, tx * pFlipX, ty * pFlipY);
    iconPoints = this.translatePoints(
      iconPoints,
      stx * sx * pFlipX,
      sty * sy * pFlipY
    );

    // 同父级一起缩放，采用父级中心点移动
    iconPoints = this.scalePoints(iconPoints, parentSx, parentsy);
    iconPoints = this.translatePoints(iconPoints, pcx, pcy);
    iconPoints = this.translatePoints(iconPoints, ptx, pty);
    return iconPoints;
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
}

export class DiagramAnnotation extends ShapeAnnotation {
  static viewScale = 5;

  constructor(graph: Graph, diagramShape: DiagramShape) {
    super(graph, diagramShape, null);
  }

  /**
   * @description: 获取路径坐标点
   * @return {*}
   */
  public getPathPoint(): Point[] {
    return this.scalePoints(
      this.extentPoints,
      DiagramAnnotation.viewScale,
      DiagramAnnotation.viewScale
    );
  }
}
