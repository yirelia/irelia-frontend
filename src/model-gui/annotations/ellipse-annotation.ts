import type { Point } from '../model';
import ShapeAnnotation from './shape-annotation';
import { ShapeType } from '../enums';
import type { Graph } from '@antv/x6';
import type { Component } from '../components/component';
import type { DiagramCell } from '@/views/simulation/model/components/graphics/type';
export default class EllipseAnnotation extends ShapeAnnotation {
  tag = ShapeType.Ellipse;

  constructor(graph: Graph, shape: DiagramCell, parent?: Component) {
    super(graph, shape, parent);
  }

  /**
   * @description: 获取两个坐标点的宽度和高度
   * @param {Point} p1
   * @param {Point} p2
   * @return {*}
   */
  public computeWidthAndHeight(p1: Point, p2: Point) {
    const width = Math.abs(p2.x - p1.x);
    const height = Math.abs(p2.y - p1.y);
    return {
      width,
      height
    };
  }

  public markup() {
    const [p1, p2] = this.getPathPoint();
    const { width, height } = this.computeWidthAndHeight(p1, p2);
    const center = this.center(p1, p2);
    const { fill, stroke, strokeWidth } = this;
    const transform = this.patchTransform(
      this.transformation.getTransformationMatrix(),
      center
    );

    return {
      tagName: 'ellipse',
      attrs: {
        cx: center.x,
        cy: center.y,
        rx: width / 2,
        ry: height / 2,
        fill,
        stroke,
        strokeWidth,
        transform,
        magnet: this.magnet
      }
    };
  }

  /**
   * @description: 圆旋转是需要针对圆心进行旋转，此处做一个补丁
   *  rotate(0, 0, 0) translate(0,0) scale(1,1) translate(0,0) rotate(-90, 0, 0) => rotate(0, 0, 0) translate(0,0) scale(1,1) translate(0,0) rotate(-90, ${center.x}, ${center.y})
   * @param {string} transform
   * @param {Point} center
   * @return {*}
   */
  public patchTransform(transform: string, center: Point): string {
    if (this.rotation !== 0) {
      const reg = /rotate\((-?\d*), (-?\d*), (-?\d*)\)$/;
      return transform.replace(reg, (all, angle) => {
        return `rotate(${angle}, ${center.x}, ${center.y})`;
      });
    }
    return transform;
  }
}
