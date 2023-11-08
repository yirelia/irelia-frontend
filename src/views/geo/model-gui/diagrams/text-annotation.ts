import type { Graph } from '@antv/x6';
import type { DiagramShape } from '../model';
import { DiagramAnnotation } from './shape-annotation';

export default class DiagramTextAnnotation extends DiagramAnnotation {
  constructor(graph: Graph, shape: DiagramShape) {
    super(graph, shape);
  }

  public markup() {
    const { color, originalTextString } = this.shape;
    const [p1, p2] = this.getPathPoint();
    const { x, y, width, height } = this.getBox(p1, p2);
    const fontColor = this.getRgbColor(color);
    const text = originalTextString;
    const fill = this.fill;
    const zIndex = this.zIndex;
    return {
      shape: 'text-block',
      x,
      y,
      width,
      height,
      text,
      attrs: {
        body: {
          fill,
          stroke: 'none'
        },
        label: {
          style: `color:${fontColor};width: 100%; height: 100%; position: static; background-color: transparent; text-align: center; margin: 0px; padding: 0px 5px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; font-size: 14px;`
        }
      },
      data: this.getData(),
      zIndex
    };
  }
}
