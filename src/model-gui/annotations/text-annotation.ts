import type { Graph } from '@antv/x6';
import type { Component } from '../components/component';
import { Transform } from '../components/transformation';
import { ShapeType } from '../enums';
import { getBigNumerIntance, getNormalizedAngle } from '../utils';
import ShapeAnnotation from './shape-annotation';
import type { DiagramShape } from '../model';

export default class TextAnnotation extends ShapeAnnotation {
  public tag = ShapeType.Text;
  // 最小文本大小 8pt => 8 * (72 / 96)
  private minimumFontSize = 6;
  constructor(graph: Graph, shape: DiagramShape, parent?: Component) {
    super(graph, shape, parent);
  }

  /**
   * @description:
   * TODO 处理文本的剧中属性&& style 样式属性
   * @return {*}
   */
  public markup() {
    const { textColor, originalTextString } = this;
    const [p1, p2] = this.getPathPoint();
    const { x, y, width, height } = this.getBox(p1, p2);
    const transform = this.transformation.getTransformationMatrix();
    const divHight = `${height}px`;
    const htmlTransform = this.getTextTransformScale(transform);
    const fontObj = this.patchFontSize(
      originalTextString,
      this.minimumFontSize,
      width,
      height
    );
    return {
      tagName: 'foreignObject',
      attrs: {
        x,
        y,
        width: `${fontObj.boudingWidth}`,
        height,
        transform
      },
      children: [
        {
          tagName: 'div',
          ns: 'http://www.w3.org/1999/xhtml',
          attrs: {},
          style: {
            height: divHight,
            textAlign: 'center',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            lineHeight: divHight,
            color: `${textColor}`,
            fontSize: `${fontObj.fontSize}px`,
            transform: htmlTransform
          },
          textContent: originalTextString
        }
      ]
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
    const componentRotation = this.component?.componentInfo.rotation || 0;
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

  public getBoundingRect(text: string, fontSize: number) {
    const context = Measuretext.getContext();
    context.font = `${fontSize}px sans-serif`;
    // Measure the text
    const textWidth = context.measureText(text).width;
    const textHeight = fontSize;
    // Return the bounding rectangle
    const BigNumber = getBigNumerIntance();
    return {
      width: Math.ceil(textWidth),
      // 高度扩充 0.2倍，适配一些字体展示不全
      height: new BigNumber(textHeight).multipliedBy(1.2).toNumber()
    };
  }

  /**
   * @description: 根据缩放因子计算文本大小
   * @return {*}
   */
  private patchFontSize(
    text: string,
    defaultFontSize: number,
    absBoundingWidth: number,
    absBoundingHeight: number
  ): { fontSize: number; boudingWidth: number } {
    const fontBoundFont = this.getBoundingRect(text, defaultFontSize);
    const xFactor = absBoundingWidth / fontBoundFont.width;
    const yFactor = absBoundingHeight / fontBoundFont.height;
    const factor =
      absBoundingWidth !== 0 && xFactor < yFactor ? xFactor : yFactor;
    // 计算出实际fontsize
    const fontSize = Math.floor(this.minimumFontSize * factor);
    // 兼容 width 为0 的场景
    if (absBoundingWidth === 0) {
      absBoundingWidth = text.length * fontSize;
    }
    return {
      fontSize,
      boudingWidth: absBoundingWidth
    };
  }

  private truncateText(text: string, maxWidth: number, font: number) {
    const context = Measuretext.getContext();

    // 设置绘图上下文的字体样式
    context.font = `${font}`;
    // 使用measureText方法测量文本的宽度
    const textWidth = context.measureText(text).width;

    // 如果文本宽度超过最大宽度，则进行截取
    if (textWidth > maxWidth) {
      const ellipsis = '...';
      const ellipsisWidth = context.measureText(ellipsis).width;
      const characters = text.split('');
      let width = 0;
      for (let i = 0; i < characters.length; i++) {
        width += context.measureText(characters[i]).width;
        if (width + ellipsisWidth > maxWidth) {
          return characters.slice(0, i).join('') + ellipsis;
        }
      }
    }

    // 如果文本宽度未超过最大宽度，则返回原始文本
    return text;
  }
}

class Measuretext {
  private static context: null | CanvasRenderingContext2D;
  constructor() {}
  public static getContext() {
    if (!Measuretext.context) {
      const canvas = document.createElement('canvas');
      Measuretext.context = canvas.getContext('2d');
    }
    return Measuretext.context;
  }
}
