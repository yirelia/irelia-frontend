/**
 * 建模画布上每个节点业务数据类型
 * 分别区分了
 * Component: 组件
 * Inputoutput: 输入输出的连接框
 * Diagram: 注释边框
 *
 */

import type { GraphDataTagEnum } from '../enums';
import type { DiagramComponent } from './component';
import type { DiagramShape } from './shape';

export type Line = {
  tag: GraphDataTagEnum.DiagramEdge;
  data: DiagramShape;
};

export type Component = {
  tag: GraphDataTagEnum.DiagramComponent;
  data: DiagramComponent;
};

export type Inputoutput = {
  tag: GraphDataTagEnum.DiagramInputoutput;
  data: DiagramComponent; // inputouput 自己的数据
  parent: DiagramComponent; // 父级数据
};

export type Diagram = {
  tag: GraphDataTagEnum.Diagram;
  data: DiagramShape;
};

export type Eyes = {
  tag: GraphDataTagEnum.Eyes;
  data: any;
};

// 节点对应的业务数据类型
export type BusinessData = Line | Component | Inputoutput | Diagram | Eyes;
