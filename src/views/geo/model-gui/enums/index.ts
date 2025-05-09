export * from './pattern';
export * from './arrow';
export * from './line';
export enum GraphDataTagEnum {
  DiagramEdge = 'edge',
  DiagramComponent = 'Component',
  DiagramInputoutput = 'Inputoutput',
  Diagram = 'Diagram',
  Eyes = 'Eyes',
  Var = 'Var' // 自定义变量组件
}

// 视图类型
export enum ViewType {
  Diagram = 'Diagram', // 组件主体
  Icon = 'Icon', // 组件端口
  View = 'ViewDiagram' // 组件视图
}

// 图形类型
export enum ShapeType {
  Rectangle = 'Rectangle',
  Line = 'Line',
  Polygon = 'Polygon',
  Ellipse = 'Ellipse',
  Text = 'Text',
  Bitmap = 'Bitmap'
}

export enum ModelicaClasses {
  Model = 'model',
  Class = 'class',
  ExpandableConnector = 'expandable connector',
  Connector = 'connector',
  Record = 'record',
  Block = 'block',
  Function = 'function',
  Package = 'package',
  Primitive = 'primitive',
  Type = 'type',
  Operator = 'operator',
  OperatorRecord = 'operatorRecord',
  OperatorFunction = 'operatorFunction',
  Optimization = 'optimization',
  Parameter = 'parameter',
  Constant = 'constant',
  Protected = 'protected',
  Enumeration = 'enumeration'
}

// 翻转枚举
export enum Flip {
  IsFlip = -1, // 翻转
  NoFlip = 1 // 未翻转
}

// 默认缩放比例为5
export const ViewScale = 1;

// 网格大小
export const GridSize = 2;

// 端口的形状，设置可连接属性magnet
export const ConnectorShape = ['image', 'ellipse', 'polygon'];

export enum ShapeLayer {
  AnnotationZIndex = 1, // 注释的层级
  ComponentZIndex = 2, // 组件的层级
  EdgeZIndex = 3, // 边的层级
  ComponentPortZIndex = 4 // 组件端口的层级
}
