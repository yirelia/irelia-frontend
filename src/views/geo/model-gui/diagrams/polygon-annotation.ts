import type { Graph } from '@antv/x6';
import { ShapeType } from '../enums';
import type { DiagramShape, PointArray } from '../model';
import { DiagramAnnotation } from './shape-annotation';

export default class DiagramPolygonAnnotation extends DiagramAnnotation {
  tag = ShapeType.Polygon;

  constructor(graph: Graph, shape: DiagramShape) {
    super(graph, shape);
  }

  public markup() {
    const { smooth } = this.shape;
    const linePoints = this.getPathPoint();
    const strokeWidth = this.lineThickness;
    const stroke = this.lineColor;
    const fill = this.fill;
    const isBezier = smooth === 'Smooth.Bezier';
    const path = this.getLine(linePoints, isBezier);
    if (isBezier) {
      return {
        tagName: 'path',
        attrs: {
          d: path,
          fill,
          stroke,
          strokeWidth
        }
      };
    }
    return {
      tagName: 'polygon',
      attrs: {
        points: path,
        fill,
        stroke
      }
    };
  }

  /**
   * @description: 获取Line 路径，区分是否为贝塞尔曲线
   * @param {*} linePoints
   * @param {boolean} isBezier
   * @return {*}
   */
  public getLine(linePoints, isBezier: boolean) {
    return isBezier
      ? this.formatPolylineSmoothPath(linePoints)
      : this.formatPolylineNomalPath(linePoints);
  }

  public formatPolylineSmoothPath(linePoints) {
    const pointLen = linePoints.length;
    const path = [];
    if (pointLen > 0) {
      const { x, y } = linePoints[0];
      path.push(`M${x},${y}`);
      if (pointLen === 2) {
        path.push(`L${x},${y}`);
      } else {
        for (let i = 2; i < pointLen; i++) {
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
          path.push(
            `L${point12.x},${point12.y}`,
            `C${point12.x},${point12.y} ${point2.x},${point2.y} ${point23.x},${point23.y}`
          );
          // if its the last point
          if (i === pointLen - 1) {
            path.push(`L${point3.x},${point3.y}`);
          }
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
