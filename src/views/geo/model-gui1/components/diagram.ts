import type { Graph, Markup } from "@antv/x6";
import type { DiagramShape } from "../model";
import {
  BitmapAnnotation,
  EllipseAnnotation,
  LineAnnotation,
  PolygonAnnotation,
  RectangleAnnotation,
  TextAnnotation,
} from "../annotations";
import { ShapeLayer } from "../enums";

export class Diagram {
  public graph: Graph;
  public rawShape: DiagramShape;
  public zIndex = ShapeLayer.AnnotationZIndex;
  constructor(graph: Graph, shape: DiagramShape) {
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
      case "Rectangle":
        return new RectangleAnnotation(
          this.graph,
          this.rawShape
        ).markup() as unknown as Markup;
      case "Line":
        return new LineAnnotation(
          this.graph,
          this.rawShape
        ).markup() as unknown as Markup;
      case "Polygon":
        return new PolygonAnnotation(
          this.graph,
          this.rawShape
        ).markup() as unknown as Markup;
      case "Ellipse":
        return new EllipseAnnotation(
          this.graph,
          this.rawShape
        ).markup() as unknown as Markup;
      case "Text":
        return new TextAnnotation(
          this.graph,
          this.rawShape
        ).markup() as unknown as Markup;
      case "Bitmap":
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
    return {
      x: 0,
      y: 0,
      zIndex: zIndex,
      markup: [markup],
    };
  }
}
