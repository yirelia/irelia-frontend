import type { Graph, Markup } from '@antv/x6';
import type { DiagramCell } from '@/views/simulation/model/components/graphics/type';
import {
  BitmapAnnotation,
  EllipseAnnotation,
  LineAnnotation,
  PolygonAnnotation,
  RectangleAnnotation,
  TextAnnotation
} from '../annotations';
import { GraphDataTagEnum, ShapeLayer } from '../enums';

export class Diagram {
  public graph: Graph;
  public rawShape: DiagramCell;
  public zIndex = ShapeLayer.AnnotationZIndex;
  constructor(graph: Graph, shape: DiagramCell) {
    this.graph = graph;
    this.rawShape = shape;
  }

  /**
   * @description: 创建不同的节点
   * @return {*}
   */
  public getMarkUp(): Markup {
    const shapeType = this.rawShape.type;
    switch (shapeType) {
      case 'Rectangle':
        return new RectangleAnnotation(
          this.graph,
          this.rawShape
        ).markup() as unknown as Markup;
      case 'Line':
        return new LineAnnotation(
          this.graph,
          this.rawShape
        ).markup() as unknown as Markup;
      case 'Polygon':
        return new PolygonAnnotation(
          this.graph,
          this.rawShape
        ).markup() as unknown as Markup;
      case 'Ellipse':
        return new EllipseAnnotation(
          this.graph,
          this.rawShape
        ).markup() as unknown as Markup;
      case 'Text':
        return new TextAnnotation(
          this.graph,
          this.rawShape
        ).markup() as unknown as Markup;
      case 'Bitmap':
        return new BitmapAnnotation(
          this.graph,
          this.rawShape
        ).markup() as unknown as Markup;
      default:
        // 这个分支用该永远都走不到
        return new RectangleAnnotation(
          this.graph,
          this.rawShape
        ).markup() as unknown as Markup;
    }
  }

  public createNode() {
    const markup = this.getMarkUp();
    const { zIndex } = this;
    // 此处坐标系就是原点，不需要移动
    return this.graph.addNode({
      data: {
        tag: GraphDataTagEnum.Diagram,
        data: this.rawShape
      },
      zIndex,
      markup
    });
  }
  // 只返回节点数据，批量添加
  public getNode() {
    const markup = this.getMarkUp();
    const { zIndex } = this;
    // 此处坐标系就是原点，不需要移动
    return {
      data: {
        tag: GraphDataTagEnum.Diagram,
        data: this.rawShape
      },
      zIndex,
      markup
    };
  }
}
