import type { Graph } from '@antv/x6';
import type { DiagramShape } from '../model';
import DiagramAnnotaion from '../diagrams';

export class Diagram {
  public graph: Graph;
  public shape: DiagramShape;
  constructor(graph: Graph, shape: DiagramShape) {
    this.graph = graph;
    this.shape = shape;
  }

  /**
   * @description: 创建不同的节点
   * @return {*}
   */
  public getMarkUp() {
    const shapeType = this.shape.type;
    if (shapeType === 'Rectangle') {
      return new DiagramAnnotaion.DiagramRectAnnotation(
        this.graph,
        this.shape
      ).markup();
    } else if (shapeType === 'Line') {
      return new DiagramAnnotaion.DiagramLineAnnotation(
        this.graph,
        this.shape
      ).markup();
    }
    // TODO 多边形
    // else if (shapeType=== 'Polygon') {
    // return new DiagramAnnotaion.DiagramPolygonAnnotation(this.graph,  this.shape).markup()
    // }
    else if (shapeType === 'Ellipse') {
      return new DiagramAnnotaion.DiagramEllipseAnnotation(
        this.graph,
        this.shape
      ).markup();
    } else if (shapeType === 'Text') {
      return new DiagramAnnotaion.DiagramTextAnnotation(
        this.graph,
        this.shape
      ).markup();
    } else if (shapeType === 'Bitmap') {
      return new DiagramAnnotaion.DiagramBitmapAnnotation(
        this.graph,
        this.shape
      ).markup();
    }
    return new DiagramAnnotaion.DiagramRectAnnotation(
      this.graph,
      this.shape
    ).markup();
  }

  public createNode() {
    const node = this.getMarkUp();
    if (this.shape.type === 'Line') {
      return this.graph.addEdge(node);
    }
    return this.graph.addNode(node as any);
  }
}
