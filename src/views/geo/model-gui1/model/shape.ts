export interface DiagramShape {
  borderPattern: string;
  color: string;
  extentsPoints: string[];
  fillColor: string;
  fillPattern: string;
  linePattern: string;
  lineThickness: string;
  originalPoint: string;
  radius: string;
  rotation: string;
  type: string;
  visible: string;
  points: string[]; // 线段坐标数组
  smooth: string;
  polygonPoints: string[]; // 多边形数组
  imageBase64: string;
  textType: string; // 文本类型
  originalTextString: string; // 原始数据类型
  diagram: boolean; // 是否为 diagram 外面图框类型
  mobility: false;
  arrow: string;
  tag?: string;
  magnet: boolean; //可连接桩状态
  opacity?: number; // 是否可以见
  isCustom?: boolean; // 是否为用户扩展的图形
  [index: string]: any; // 后期扩展
}

export class DefaultDiagramShape {
  borderPattern: "none";
  color: "";
  extentsPoints: string[];
  fillColor: string;
  fillPattern: string;
  linePattern: string;
  lineThickness: string;
  originalPoint: string;
  radius: string;
  rotation: string;
  type: string;
  visible: string;
  points: string[]; // 线段坐标数组
  smooth: string;
  polygonPoints: string[]; // 多边形数组
  imageBase64: string;
  textType: string; // 文本类型
  originalTextString: string; // 原始数据类型
  diagram: false; // 是否为 diagram 外面图框类型
  mobility: false;
  arrow: string;
  tag?: string;
}
