import type { Point } from '@/utils/simulation/model-gui/model';
import type { GraphCell } from '@/views/simulation/model/components/graphics/type';
import { Flip, ModelicaClasses } from '../enums';
import { getBigNumerIntance, toNum, toPoint } from '../utils';
const BigNumber = getBigNumerIntance();
export class ComponentInfo {
  public x = 0;
  public y = 0;
  public width = 200;
  public height = 200;
  public originDiagram: Point = {
    x: 0,
    y: 0
  };
  public extent1Diagram: Point = {
    x: 0,
    y: 0
  };
  public extent2Diagram: Point = {
    x: 0,
    y: 0
  };
  public rotation = 0;

  public className = '';

  public name = '';

  public isInner = false;

  public isOuter = false;

  private viewScale = 1;

  public rawComponentInfo!: GraphCell;

  public isConnector = false;

  constructor(viewScale = 1, componentInfo?: GraphCell) {
    // 优先初始化
    this.viewScale = viewScale;
    if (componentInfo) {
      this.updateComponentInfo(componentInfo);
    }
  }

  public updateComponentInfo(componentInfo: GraphCell) {
    this.rawComponentInfo = componentInfo;
    if (componentInfo.extents && componentInfo.extents.length) {
      this.extent1Diagram = toPoint(
        componentInfo.extents[0],
        this.viewScale,
        this.viewScale
      );

      this.extent2Diagram = toPoint(
        componentInfo.extents[1],
        this.viewScale,
        this.viewScale
      );
    }

    if (componentInfo.origin) {
      this.originDiagram = toPoint(
        componentInfo.origin,
        this.viewScale,
        this.viewScale
      );
    }
    // 重要坐标系角度转换
    this.rotation = -toNum(componentInfo.rotation);

    this.width = Math.abs(this.extent1Diagram.x - this.extent2Diagram.x);
    this.height = Math.abs(this.extent1Diagram.y - this.extent2Diagram.y);
    const viewCenter = this.getViewCenter();
    // 中心点才是 node 节点偏移量
    this.x = viewCenter.x;
    this.y = viewCenter.y;
    this.isConnector =
      componentInfo.restriction === ModelicaClasses.ExpandableConnector ||
      componentInfo.restriction === ModelicaClasses.Connector;
    this.name = this.rawComponentInfo.name;
  }

  /**
   * @description: 水平翻转状态
   * @return {*}
   */
  public get flipX(): number {
    return this.extent2Diagram.x < this.extent1Diagram.x
      ? Flip.IsFlip
      : Flip.NoFlip;
  }

  public get flipY(): number {
    return this.extent2Diagram.y > this.extent1Diagram.y
      ? Flip.IsFlip
      : Flip.NoFlip;
  }

  public get center() {
    return {
      x: new BigNumber(this.extent1Diagram.x)
        .plus(this.extent2Diagram.x)
        .div(2)
        .toNumber(),
      y: new BigNumber(this.extent1Diagram.y)
        .plus(this.extent2Diagram.y)
        .div(2)
        .toNumber()
    };
  }

  public getSubShape() {
    const magnetShape = this.getMagnetShape();
    return [...this.rawComponentInfo.subShapes, magnetShape];
  }

  public getSubShapeNoCenter() {
    return [...this.rawComponentInfo.subShapes];
  }

  public getViewPosition() {
    return {
      x: this.x + this.originDiagram.x,
      y: this.y + this.originDiagram.y
    };
  }

  public getViewCenter() {
    return {
      x: this.center.x + this.originDiagram.x,
      y: this.center.y + this.originDiagram.y
    };
  }

  public getMagnetShape() {
    const [extent1Diagram, extent2Diagram] = this.geteExtentDiagram();
    return {
      extentsPoints: [extent1Diagram, extent2Diagram],
      fillColor: [255, 255, 255],
      fillPattern: {
        name: 'FillPattern.None',
        index: 1,
        kind: 'enum'
      },
      linePattern: {
        name: 'LinePattern.None',
        index: 1,
        kind: 'enum'
      },
      thickness: 0.25,
      type: 'Rectangle',
      visible: true,
      borderRadius: 0,
      rotation: 0,
      points: [],
      textString: '',
      mobility: false,
      arrow: [
        {
          index: 1,
          kind: 'enum',
          name: 'Arrow.None'
        }
      ],
      magnet: this.isConnector
    };
  }

  public geteExtentDiagram() {
    const extent = this.rawComponentInfo.coordinateSystem?.extent ?? [
      [0, 0],
      [0, 0]
    ];
    return this.rawComponentInfo.parentName
      ? extent
      : extent.map(item => item.map(it => it * 0.2));
  }
}
