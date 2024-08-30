import type { Graph } from '@antv/x6';
import { ShapeType } from '../enums';
import type { PointArray } from '../model';
import ShapeAnnotation from './shape-annotation';
import type { Component } from '../components/component';
import type { DiagramCell } from '@/views/simulation/model/components/graphics/type';
export default class PolygonAnnotation extends ShapeAnnotation {
  tag = ShapeType.Polygon;
  private isBezier = false;
  constructor(graph: Graph, shape: DiagramCell, parent?: Component) {
    super(graph, shape, parent);
    this.isBezier = this.rawShape.smooth?.name === 'Smooth.Bezier';
  }

  public markup() {
    const { stroke, strokeWidth } = this;
    const linePoints = this.getPathPoint();
    const fill = this.fill;
    const transform = this.transformation.getTransformationMatrix();
    const path = this.getLine(linePoints, this.isBezier);
    if (this.isBezier) {
      return {
        tagName: 'path',
        attrs: {
          d: path,
          fill,
          stroke,
          strokeWidth,
          transform,
          magnet: this.magnet
        }
      };
    }
    return {
      tagName: 'polygon',
      attrs: {
        points: path,
        fill,
        stroke,
        transform,
        magnet: this.magnet
      }
    };
  }

  /**
   * @description: 获取Line 路径，区分是否为贝塞尔曲线
   * @param {*} linePoints
   * @param {boolean} isBezier
   * @return {*}
   */
  public getLine(linePoints: PointArray, isBezier: boolean) {
    return isBezier
      ? this.formatPolylineSmoothPath(linePoints)
      : this.formatPolylineNomalPath(linePoints);
  }

  public formatPolylineSmoothPath(linePoints: PointArray) {
    const pointLen = linePoints.length;
    const path = [];
    if (pointLen > 0) {
      const { x, y } = linePoints[0];
      path.push(`M${x},${y}`);
      if (pointLen === 2) {
        const { x: endX, y: endY } = linePoints[1];
        path.push(`L${endX},${endY}`);
      } else {
        // 补充 两个点，实现图形的闭合
        linePoints.push(linePoints[0], linePoints[1]);
        for (let i = 2; i < linePoints.length; i++) {
          const point3 = linePoints[i];
          // calculate middle points for bezier curves
          const point2 = linePoints[i - 1];
          const point1 = linePoints[i - 2];
          const point12 = {
            x: (point1.x + point2.x) / 2,
            y: (point1.y + point2.y) / 2
          };
          const point23 = {
            x: (point2.x + point3.x) / 2,
            y: (point2.y + point3.y) / 2
          };
          if (i === 2) {
            path.push(`M${point12.x},${point12.y}`);
          }
          path.push(
            `C${point12.x},${point12.y} ${point2.x},${point2.y} ${point23.x},${point23.y}`
          );
        }
      }
    }
    return path.join(' ');
  }

  public formatPolylineNomalPath(polyPoints: PointArray) {
    const pointLen = polyPoints.length;
    let dPath = '';
    for (let index = 0; index < pointLen; index++) {
      const { x, y } = polyPoints[index];
      dPath += `${x},${y} `;
    }
    return dPath;
  }
}
