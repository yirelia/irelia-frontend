import type { Graph } from '@antv/x6';
import type { DiagramShape, Point } from '../model';
import ShapeAnnotation from '../annotations/shape-annotation';
import { GraphDataTagEnum, ShapeLayer, ViewScale } from '../enums';

export class DiagramAnnotation extends ShapeAnnotation {
  static viewScale = ViewScale;

  public zIndex = ShapeLayer.AnnotationZIndex;
  // TODO 添加 添加变换
  constructor(graph: Graph, diagramShape: DiagramShape) {
    super(graph, diagramShape, null);
  }

  /**
   * @description: 获取路径坐标点
   * @return {*}
   */
  public getPathPoint(): Point[] {
    return this.scalePoints(
      this.extentPoints,
      DiagramAnnotation.viewScale,
      DiagramAnnotation.viewScale
    );
  }

  /**
   * @description: 获取业务数据
   * @return {*}
   */
  public getData() {
    return {
      tag: GraphDataTagEnum.Diagram,
      data: this.shape
    };
  }
}
