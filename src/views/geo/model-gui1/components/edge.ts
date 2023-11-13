import type { Graph } from "@antv/x6";
import type { DiagramEdage, Point } from "../model";
import { convertMMToPixel, toNum, toPoint } from "../utils";
import { GraphDataTagEnum, ShapeLayer, ViewScale } from "../enums";

/**
 * @description: 边的类型
 * @return {*}
 */
export class ComponentEdge {
  public graph: Graph;
  public edge: DiagramEdage;

  static viewScale = ViewScale;

  public extentPoints: Point[] = [];

  public zIndex = ShapeLayer.EdgeZIndex;

  // 线宽
  public strokeWidth = 0;

  // 线条颜色
  public stroke = "";

  // 间隔线
  public strokeDasharray = 0;

  constructor(graph: Graph, edge: DiagramEdage) {
    this.graph = graph;
    this.edge = edge;
    this.extentPoints = edge.points.map((point) =>
      toPoint(point, ComponentEdge.viewScale, ComponentEdge.viewScale)
    );
    this.setConfig();
  }

  /**
   * @description: 设置配置
   * @return {*}
   */
  public setConfig() {
    this.strokeWidth = convertMMToPixel(toNum(this.edge.lineThickness));
    this.stroke = `rgb(${this.edge.color})`;
    this.strokeDasharray =
      this.edge.linePattern !== "LinePattern.Solid" ? 5 : 0;
  }

  /**
   * @description: 新增边
   * @return {*}
   */
  public addEdge() {
    let sourceId = this.edge.connectionfrom;
    let targetId = this.edge.connectionto;
    const vertices = this.extentPoints;
    let sourceCell = this.graph.getCellById(sourceId);
    if (!sourceCell) {
      sourceCell = this.getIOConnectCell(sourceId)!;
      if (sourceId.includes(".")) {
        sourceId = sourceId.split(".")[0];
      }
    }
    let targetCell = this.graph.getCellById(targetId);
    if (!targetCell) {
      targetCell = this.getIOConnectCell(targetId)!;
      if (targetId.includes(".")) {
        targetId = targetId.split(".")[0];
      }
    }
    if (sourceCell && targetCell) {
      const data = {
        tag: GraphDataTagEnum.DiagramEdge,
        data: this.edge,
      };
      return this.graph.addEdge({
        source: { cell: sourceId, selector: '[magnet="true"]' },
        target: { cell: targetId, selector: '[magnet="true"]' },
        vertices,
        router: {
          padding: 0,
          name: "orth",
          args: {
            padding: {
              right: -20,
              left: -20,
              top: -20,
              bottom: -20,
              vertical: -20,
              horizontal: -20,
            },
          },
        },
        attrs: {
          line: {
            sourceMarker: {
              name: "block",
              size: 0.0001,
            },
            targetMarker: {
              name: "block",
              size: 0.0001,
            },
            strokeWidth: this.strokeWidth,
            stroke: this.stroke,
            strokeDasharray: this.strokeDasharray,
          },
        },
        data,
        zIndex: this.zIndex,
      });
    }
  }

  /**
   * @description: 获取可连接的组件
   *  场景1： 查询到 输入输出组件 直接返回
   *  场景2： 未查询 IO 组件 则查询IO的父组件，根据 graphType 决定是否返回 connector
   * @param {*} cellId
   * @return {*}
   */
  public getIOConnectCell(ioCellId: string) {
    const targetCell = this.graph.getCellById(ioCellId);
    if (targetCell) {
      return targetCell;
    }
    if (!ioCellId.includes(".")) {
      return null;
    }
    const parnetCellName = ioCellId.split(".")[0];
    const parnetCell = this.graph?.getCellById(parnetCellName);
    const data = parnetCell.getData();
    if (data?.data?.graphType.includes("connector")) {
      return parnetCell;
    }
    return null;
  }
}
