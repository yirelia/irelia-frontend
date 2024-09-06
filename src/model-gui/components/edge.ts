import type { Graph } from '@antv/x6';
import { map } from 'lodash-es';
import type { Point } from '../model';
import { convertMMToPixel, toNum, toPoint } from '../utils';
import { GraphDataTagEnum, ShapeLayer, ViewScale } from '../enums';
import type { LineCell } from '@/views/simulation/model/components/graphics/type';
/**
 * @description: 边的类型
 * @return {*}
 */
export class ComponentEdge {
  public graph: Graph;
  public edge: LineCell;

  static viewScale = ViewScale;

  public extentPoints: Point[] = [];

  public zIndex = ShapeLayer.EdgeZIndex;

  // 线宽
  public strokeWidth = 0;

  // 线条颜色
  public stroke = '';

  // 间隔线
  public strokeDasharray = 0;

  constructor(graph: Graph, edge: LineCell) {
    this.graph = graph;
    this.edge = edge;
    if (edge.points) {
      this.extentPoints = edge.points.map(point =>
        toPoint(point, ComponentEdge.viewScale, ComponentEdge.viewScale)
      );
    }
    this.setConfig();
  }

  /**
   * @description: 设置配置
   * @return {*}
   */
  public setConfig() {
    this.strokeWidth = convertMMToPixel(toNum(this.edge.thickness || 0.25));
    this.stroke = `rgb(${this.edge.color || [0, 0, 127]})`;
    this.strokeDasharray =
      this.edge.linePattern &&
        this.edge.linePattern?.name !== 'LinePattern.Solid'
        ? 5
        : 0;
  }

  /**
   * @description: 新增边,TODO,新的接口类型可以简化
   * @return {*}
   */
  public addEdge(isBatch = false) {
    let sourceId = map(this.edge.lhs, 'name').join('_');
    let targetId = map(this.edge.rhs, 'name').join('_');
    const vertices = this.extentPoints;
    let sourceCell = this.graph.getCellById(sourceId);
    if (!sourceCell) {
      sourceCell = this.getIOConnectCell(sourceId)!;
      if (sourceId?.includes('.')) {
        sourceId = sourceId.split('.')[0];
      }
    }
    let targetCell = this.graph.getCellById(targetId);
    if (!targetCell) {
      targetCell = this.getIOConnectCell(targetId)!;
      if (targetId?.includes('.')) {
        targetId = targetId.split('.')[0];
      }
    }
    if (sourceCell && targetCell) {
      const data = {
        tag: GraphDataTagEnum.DiagramEdge,
        data: this.edge
      };
      const edge = {
        source: { cell: sourceId, selector: '[magnet="true"]' },
        target: { cell: targetId, selector: '[magnet="true"]' },
        vertices,
        router: {
          padding: 0,
          name: 'orth',
          args: {
            padding: {
              right: -20,
              left: -20,
              top: -20,
              bottom: -20,
              vertical: -20,
              horizontal: -20
            }
          }
        },
        // router: {
        //   name: 'manhattan',
        //   args: {
        //     excludeTerminals: ['source', 'target'],
        //     excludeHiddenNodes: true,
        //     excludeNodes: obstacles,
        //     padding: 0
        //   }
        // },
        attrs: {
          line: {
            sourceMarker: {
              name: 'block',
              size: 0.0001
            },
            targetMarker: {
              name: 'block',
              size: 0.0001
            },
            strokeWidth: this.strokeWidth,
            stroke: this.stroke,
            strokeDasharray: this.strokeDasharray
          }
        },
        data,
        zIndex: this.zIndex
      };
      return isBatch ? edge : this.graph.addEdge(edge);
    }
  }

  /**
   * @description: 获取可连接的组件
   *  场景1： 查询到 输入输出组件 直接返回
   *  场景2： 未查询 IO 组件 则查询IO的父组件，根据 restriction 决定是否返回 connector
   * @param {*} cellId
   * @return {*}
   */
  public getIOConnectCell(ioCellId: string) {
    const targetCell = this.graph.getCellById(ioCellId);
    if (targetCell) {
      return targetCell;
    }
    if (!ioCellId?.includes('.')) {
      return null;
    }
    const parnetCellName = ioCellId.split('.')[0];
    const parnetCell = this.graph?.getCellById(parnetCellName);
    const data = parnetCell?.getData();
    if (data?.data?.restriction?.includes('connector')) {
      return parnetCell;
    }
    return null;
  }
}
