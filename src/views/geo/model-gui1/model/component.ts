/***
 * 建模组件的数据结构类型
 *
 */

import type { DiagramShape } from "./shape";

export interface DiagramComponent {
  classname: string;
  extent1Diagram: string; // 左下角坐标
  extent2Diagram: string; // 右上角坐标
  graphType: string;
  inputOutputs: DiagramComponent[];
  mobility: false;
  name: string;
  originDiagram: string;
  original_name: string;
  output_type: string;
  parent: string;
  rotateAngle: string;
  rotation: string;
  subShapes: DiagramShape[];
  type: string;
  visible: string;
  diagram?: boolean; // 是否为外边框
  tag?: string;
  is_extend?: boolean; // 是否为继承
  extend_name: string; // 继承类的名称
  connector_sizing?: number; // 连接数
  visibleList: any[]; // 变量数组
  coordinate_system: CoOrdinateSystem;
}

export type CoOrdinateSystem = {
  // 系统坐标
  extent1_diagram: [number, number];
  extent2_diagram: [number, number];
  initial_scale: number;
  preserve_aspect_ratio: boolean;
};
