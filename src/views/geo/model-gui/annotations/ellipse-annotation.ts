import BigNumber from "bignumber.js"
import { Transformation } from "../component/transformation"
import { DiagramShape, Point } from "../model"
import { toPoint } from "../utils"
import ShapeAnnotation from "./shape-annotation"
import { ShapeType } from "../enums"
import type { Graph } from "@antv/x6"
import { Component } from "../component/component"

export default class EllipseAnnotation extends ShapeAnnotation {
  tag = ShapeType.Ellipse

  constructor(graph: Graph, shape: DiagramShape, parent: Component) {
    super(graph, shape, parent)
    this.transformation = new Transformation(this, parent)
  }

  /**
 * @description: 获取两个坐标点的宽度和高度
 * @param {Point} p1
 * @param {Point} p2
 * @return {*}
 */
  public computeWidthAndHeight(p1: Point, p2: Point) {
    const width = Math.abs(p2.x - p1.x)
    const height = Math.abs(p2.y - p1.y)
    return {
      width,
      height
    }
  }


  /**
* @description: 获取盒子中心点
* @param {Point} p1
* @param {Point} p2
* @return {*}
*/
  public center(p1: Point, p2: Point) {
    const x = new BigNumber(p1.x).plus(p2.x).div(2).toNumber()
    const y = new BigNumber(p1.y).plus(p2.y).div(2).toNumber()
    return {
      x,
      y
    }
  }

  public markup() {
    const [p1, p2] = this.getPathPoint()
    const { width, height } = this.computeWidthAndHeight(p1, p2)
    const center = this.center(p1, p2)
    const fill = this.fill
    const stroke = this.lineColor
    const strokeWidth = this.lineThickness
    const transform = this.transformation.getTransformationMatrix()
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
    }
  }
}
