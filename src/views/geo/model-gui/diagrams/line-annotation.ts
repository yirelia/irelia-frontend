import type { Graph } from '@antv/x6';

import { ShapeType } from '../enums';
import type { DiagramShape, PointArray } from '../model';
import { DiagramAnnotation } from './shape-annotation';

export default class LineAnnotation extends DiagramAnnotation {
  tag = ShapeType.Line;

  constructor(graph: Graph, shape: DiagramShape) {
    super(graph, shape);
  }

  /**
   * @description: 处理一般线段坐标
   * @param {*} linePoints
   * @return {*}
   */
  public formatNormalLine(linePoints: PointArray) {
    const linePointLen = linePoints.length;
    const pointPath = [];
    for (let index = 0; index < linePointLen; index++) {
      const { x, y } = linePoints[index];
      if (index === 0) {
        pointPath.push(`M${x},${y}`);
      } else {
        pointPath.push(`L${x},${y}`);
      }
    }
    return pointPath.join(' ');
  }

  /**
   * @description: 格式化线段的贝塞尔曲线
   * @param {*} linePoints
   * @return {*}
   */
  public formatBezierLine(linePoints: PointArray) {
    const linePointLen = linePoints.length;
    let linePath = '';
    for (let index = 0; index < linePointLen + 1; index++) {
      if (index === 0) {
        const { x, y } = linePoints[index];
        linePath += `M${x},${y} `;
      } else if (index === 1) {
        const { x: point0X, y: point0Y } = linePoints[0];
        const { x: point1X, y: point1Y } = linePoints[1];
        linePath += `L${((point0X + point1X) / 2 + point0X) / 2},${
          ((point0Y + point1Y) / 2 + point0Y) / 2
        }`;
      } else if (index === linePointLen) {
        const { x, y } = linePoints[linePointLen - 1];
        linePath += `L${x},${y}`;
      } else {
        const { x: x1, y: y1 } = linePoints[index - 2];
        const { x: x2, y: y2 } = linePoints[index - 1];
        const { x: x3, y: y3 } = linePoints[index];
        linePath += `C${(x1 + x2) / 2},${(y1 + y2) / 2} ${x2},${y2} ${
          (x2 + x3) / 2
        },${(y2 + y3) / 2}`;
      }
    }
    return linePath;
  }

  public markup() {
    const [sourceArrow, targetArrow] = this.getArrowType();

    const sourceMarker = this.getArrowMarker(sourceArrow);
    const targetMarker = this.getArrowMarker(targetArrow);
    const data = this.getData();
    const points = this.getPathPoint();
    const stroke = this.lineColor;
    const fill = this.fill;
    const zIndex = this.zIndex;
    const strokeDasharray =
      this.shape.linePattern !== 'LinePattern.Solid' ? 5 : 0;
    if (points.length > 2) {
      const source = points[0];
      const target = points[points.length - 1];
      return this.graph.createEdge({
        vertices: points,
        source,
        target,
        router: 'normal',
        attrs: {
          line: {
            stroke,
            fill,
            sourceMarker,
            targetMarker,
            strokeDasharray
          }
        },
        data,
        zIndex
      } as any);
    } else {
      const [source, target] = points;
      return this.graph.createEdge({
        source,
        target,
        router: 'normal',
        attrs: {
          specialIndex: true,
          line: {
            stroke,
            sourceMarker,
            targetMarker,
            strokeDasharray
          }
        },
        data,
        zIndex
      });
    }
  }

  public getArrowType() {
    if (this.shape.arrow) {
      return this.shape.arrow.split(',');
    }
    return ['Arrow.None', 'Arrow.None'];
  }

  public getArrowMarker(arrowType: string) {
    const color = this.getRgbColor(this.shape.color);
    if (arrowType === 'Arrow.None') {
      return {
        name: 'block',
        fillColor: '#fff',
        strokeColor: '#fff',
        size: 0.0001
      };
    } else if (arrowType === 'Arrow.Open' || arrowType === 'Arrow.Filled') {
      return {
        name: 'block',
        fillColor: color,
        strokeColor: color
      };
    }
    return {
      name: 'block',
      fillColor: '#fff',
      strokeColor: '#fff',
      size: 0.0001
    };
  }

  /**
   * @description: 获取Line 路径，区分是否为贝塞尔曲线
   * @param {*} linePoints
   * @param {boolean} isBezier
   * @return {*}
   */
  public getLine(linePoints, isBezier: boolean) {
    const pointLen = linePoints.length;
    const path = [];
    if (pointLen > 0) {
      const { x, y } = linePoints[0];
      path.push(`M${x},${y}`);
      if (isBezier) {
        if (pointLen === 2) {
          const { x, y } = linePoints[1];
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
      } else {
        for (let index = 1; index < pointLen; index++) {
          const { x, y } = linePoints[index];
          path.push(`L${x},${y}`);
        }
      }
    }
    return path.join(' ');
  }
}
