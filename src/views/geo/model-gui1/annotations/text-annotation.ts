import type { Graph } from "@antv/x6";
import type { Component } from "../components/component";
import { Transform, Transformation } from "../components/transformation";
import { ShapeType } from "../enums";
import { getNormalizedAngle } from "../utils";
import ShapeAnnotation from "./shape-annotation";
import type { DiagramShape } from "../model";
export default class TextAnnotation extends ShapeAnnotation {
  public tag = ShapeType.Text;

  constructor(graph: Graph, shape: DiagramShape, parent?: Component) {
    super(graph, shape, parent);
  }

  public markup() {
    const { color, originalTextString } = this;
    const [p1, p2] = this.getPathPoint();
    const { x, y, width, height } = this.getBox(p1, p2);
    const fontColor = color
    const transform = this.transformation.getTransformationMatrix();
    const divHight = `${height}px`;
    const htmlTransform = this.getTextTransformScale(transform);
    return {
      tagName: "foreignObject",
      attrs: {
        x,
        y,
        width,
        height,
        transform,
      },
      children: [
        {
          tagName: "div",
          ns: "http://www.w3.org/1999/xhtml",
          attrs: {},
          style: {
            height: divHight,
            textAlign: "center",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            lineHeight: divHight,
            color: `${fontColor}`,
            fontSize: `12px`,
            transform: htmlTransform,
          },
          textContent: originalTextString,
        },
      ],
    };
  }

  /**
   * @description: Text 文本翻转的适配
   * - 文本组件本身是否旋转
   *    文本组件本身已经旋转 需要 加上父组件的角度一起处理数据
   * - 父组件是否旋转
   *    180度的场景需要独立设置
   *
   * 重要： div 优先需要设置一个和父级一样的翻转保证divg 内部文本是正常的
   * 例如 父级组件x 轴翻转
   * pComponet: scale(-1, 1)
   * 文本div 首先设置一个 scale(-1, 1)，将DIV 重置随后在 在调整 div 自身的翻转
   * @return {*}
   */
  public getTextTransformScale(shapeTransform: string): string {
    const textDefaultTransform = new Transform();
    const reg = /.scale\((\d),(\d)\)./;
    // 获取 foreignObject的翻转， 然后设置给div 实现自适应的翻转
    const scaleParam = shapeTransform.match(reg);
    if (scaleParam) {
      // 参数配置 分别对应里面的 flipX flipY
      textDefaultTransform.scale(Number(scaleParam[1]), Number(scaleParam[2]));
    }
    const pFlipX = this.component?.coordinateSystem.flipX;
    const pFlipY = this.component?.coordinateSystem.flipY;
    const componentRotation = this.component?.componentInfo.rotation || 0
    const componentAngle = getNormalizedAngle(componentRotation);
    let shapeAngle = getNormalizedAngle(this.rotation);
    if (shapeAngle > 0) {
      shapeAngle = getNormalizedAngle(componentRotation + this.rotation);
      if (shapeAngle === 180) {
        textDefaultTransform.scale(-1, 1);
      }
      // 垂直翻转
      if (pFlipX === -1) {
        textDefaultTransform.scale(1, -1);
      }
      // 水平翻转
      if (pFlipY === -1) {
        // if horizontal flip
        textDefaultTransform.scale(-1, 1);
      }
    } else {
      if (componentAngle === 180) {
        textDefaultTransform.scale(-1, -1);
      }
      // 水平翻转
      if (pFlipX === -1) {
        textDefaultTransform.scale(-1, 1);
      }
      // 垂直翻转
      if (pFlipY === -1) {
        // if horizontal flip
        textDefaultTransform.scale(1, -1);
      }
    }
    return textDefaultTransform.toString();
  }
}
