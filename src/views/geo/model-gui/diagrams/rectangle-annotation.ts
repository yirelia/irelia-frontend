import type { Graph } from '@antv/x6';
import { DiagramAnnotation } from './shape-annotation';
import type { DiagramShape } from '../model';
import BigNumber from 'bignumber.js';

export default class DiagramRectAnnotation extends DiagramAnnotation {
  constructor(graph: Graph, shape: DiagramShape) {
    super(graph, shape);
  }

  public markup() {
    const [p1, p2] = this.getPathPoint();
    const { x, y, width, height } = this.getBox(p1, p2);
    const stroke = this.lineColor;
    const strokeWidth = this.lineThickness;
    const fill = this.fill;
    const zIndex = this.zIndex;
    return {
      x,
      y,
      width,
      height,
      attrs: {
        body: {
          fill,
          stroke,
          strokeWidth
        }
      },
      data: this.getData(),
      zIndex
    };
  }

  /**
   * @description: 要计算出8个点
   * 从左往右逆时针
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {string} radius
   * @return {*}
   */
  public getDPath(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: string | number
  ) {
    const radisuBigNum = new BigNumber(radius).div(10);
    const leftTopX = new BigNumber(x);
    const leftTopY = new BigNumber(y);
    const rightBottomX = leftTopX.plus(width);
    const rightBottomY = leftTopY.plus(height);
    if (radisuBigNum.toNumber() === 0) {
      return `M${x},${y} L${x + width},${y} L${x + width},${y + height} L${x},${
        y + height
      }Z`;
    }
    // 贝塞尔曲线需要有三个控制点，暂时直接用矩形定点作为顶点的坐标控制
    // 坐标规划从左上角贝塞尔曲线第一个定点开始 顺时针
    const leftTop1 = { x, y: leftTopY.plus(radisuBigNum).toNumber() };
    const leftTop2 = { x, y };
    const leftTop3 = { x: leftTopX.plus(radisuBigNum).toNumber(), y };

    const rightTop1 = { x: rightBottomX.minus(radisuBigNum).toNumber(), y };
    const rightTop2 = { x: rightBottomX.toNumber(), y: leftTopY.toNumber() };
    const rightTp3 = {
      x: rightBottomX.toNumber(),
      y: leftTopY.plus(radisuBigNum).toNumber()
    };

    const rightBottom1 = {
      x: rightBottomX.toNumber(),
      y: rightBottomY.minus(radisuBigNum).toNumber()
    };
    const rightBottom2 = {
      x: rightBottomX.toNumber(),
      y: rightBottomY.toNumber()
    };
    const rightBottom3 = {
      x: rightBottomX.minus(radisuBigNum).toNumber(),
      y: rightBottomY.toNumber()
    };

    const letBottom1 = {
      x: leftTopX.plus(radisuBigNum).toNumber(),
      y: rightBottomY.toNumber()
    };
    const leftBottom2 = { x: leftTopX.toNumber(), y: rightBottomY.toNumber() };
    const leftBottom3 = {
      x: leftTopX.toNumber(),
      y: rightBottomY.minus(radisuBigNum).toNumber()
    };

    return `M${leftTop1.x}, ${leftTop1.y}
            C${leftTop1.x},${leftTop1.y} ${leftTop2.x},${leftTop2.y} ${leftTop3.x}, ${leftTop3.y}
            L${rightTop1.x},${rightTop1.y}
            C${rightTop1.x},${rightTop1.y} ${rightTop2.x},${rightTop2.y} ${rightTp3.x},${rightTp3.y}
            L${rightBottom1.x},${rightBottom1.y}
            C${rightBottom1.x},${rightBottom1.y} ${rightBottom2.x},${rightBottom2.y} ${rightBottom3.x},${rightBottom3.y}
            L${letBottom1.x},${letBottom1.y}
            C${letBottom1.x},${letBottom1.y} ${leftBottom2.x},${leftBottom2.y} ${leftBottom3.x},${leftBottom3.y}
            L${leftBottom3.x},${leftBottom3.y}z`;
  }
}

/**
 * @description: 生成默认的矩形
 * @param {Partial} rectangle
 * @return {*}
 */
export const makeDefaultRectangle = (rectangle: Partial<DiagramShape>) => {
  const { extentsPoints, magnet, opacity } = rectangle;
  return {
    borderPattern: 'BorderPattern.None',
    color: '255,255,255',
    points: [],
    extentsPoints,
    fillColor: '192,192,192',
    fillPattern: 'FillPattern.Solid',
    linePattern: 'LinePattern.none',
    lineThickness: '0.25',
    originalPoint: '0.0,0.0',
    radius: '0.0',
    rotation: '0.0',
    type: 'Rectangle',
    visible: 'true',
    magnet,
    opacity
  };
};
