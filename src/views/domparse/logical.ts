
import { Graph } from "@antv/x6";
import { BoundingBoxAttrs, Box, RFLP, RFLPItem } from "./model";
import { X2jOptions, XMLParser } from "fast-xml-parser";
import { camelCase } from "lodash-es";
import { label } from "three/examples/jsm/nodes/Nodes.js";
Graph.registerNode(
  "Block", //定义名称
  {
    inherit: "rect", //继承的基类
    width: 160,
    height: 130,
    data: {
      parent: true,
    },
    markup: [
      {
        tagName: "rect",
        selector: "body-rect",
      },
      {
        tagName: "rect",
        selector: "name-rect",
      },

      {
        tagName: "text",
        selector: "type",
      },
      {
        tagName: "text",
        selector: "name",
      },
    ],
    attrs: {
      //定制样式
      rect: {
        refWidth: "100%",
      },
      "name-rect": {
        strokeWidth: 1,
        stroke: "#5F95FF",
        fill: "#EFF4FF",
        height: 30,
        zIndex: 10000,
      },
      "body-rect": {
        fill: "#eff4ff",
        stroke: "#000",
        strokeWidth: 0.5,
        refHeight: "100%",
        zIndex: 1,
      },
      type: {
        ref: "name-rect",
        text: "",
        refX: 0.5,
        refY: 0.3,
        fill: "#ACB9D9",
        fontFamily: "MiSans",
        fontSize: 10,
        cursor: "pointer",
      },
      name: {
        ref: "name-rect",
        text: "",
        refX: 0.5,
        refY: 0.8,
        fill: "#000000",
        fontFamily: "MiSans",
        fontSize: 10,
        cursor: "pointer",
      },
    },
  },
  true
);
export class LogicalStructure {
  private graph: Graph;

  private logicalReferenceList: RFLPItem[] = [];
  private logicalReferenceMap: Record<string, RFLPItem> = {};

  // 逻辑架构实例
  private logicalInstanceList: RFLPItem[] = [];
  private logicalInstanceMap: Record<string, RFLPItem> = {};


  // 逻辑流参考
  private logicalFlowReferenceList: RFLPItem[] = []
  private logicalFlowReference: Record<string, RFLPItem> = {};


  // LogicalFlowExpositionInstance
  private logicalFEInstanceList: RFLPItem[] = []
  private logicalFEInstanceMap: Record<string, RFLPItem> = {};

  private logicalConnectionList: RFLPItem[] = []
  private logicalConnectionMap: Record<string, RFLPItem> = {};


  constructor(graph: Graph) {
    this.graph = graph;
  }

  public rootLogicId = "";

  public clear() {
   
  this.logicalReferenceList = [];
  this.logicalReferenceMap = {};

  // 逻辑架构实例
  this.logicalInstanceList = [];
  this.logicalInstanceMap = {};


  // 逻辑流参考
  this.logicalFlowReferenceList = []
  this.logicalFlowReference = {};


  // LogicalFlowExpositionInstance
  this.logicalFEInstanceList = []
  this.logicalFEInstanceMap = {};

  this.logicalConnectionList = []
  this.logicalConnectionMap = {};
  }

  private treeData: RFLPItem[] = []

  public async loadXml(xmlFile: File) {
    const xmlString = await this.file2String(xmlFile);
    this.parseXml(xmlString);
  }

  public file2String(file: File): Promise<string> {
    return new Promise((reslove, reject) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onloadend = () => {
        reslove(reader.result as string);
      };
      reader.onerror = (err) => reject(err);
    });
  }

  public parseXml(xmlString: string) {
    const paserOption: X2jOptions = {
      ignoreAttributes: false,
      attributeNamePrefix: "",
      attributesGroupName: "attrs",
      textNodeName: '$text',
      attributeValueProcessor: (name, val, jPath) => {
        // 预处理坐标值
        const reg = /mandatory.boundingBox$/
        if (reg.test(jPath)) {
          return (name === 'YMin' || name === 'YMax') ? -Number(val) : Number(val)
        }
        return val
      },
      transformTagName: (tagName) => camelCase(tagName),
      transformAttributeName: (attributeName) => camelCase(attributeName)
    }
    const xmlParser = new XMLParser(paserOption)
    const parseResult = xmlParser.parse(xmlString).rflp
    console.log(parseResult)
    // 记录根ID
    this.rootLogicId = parseResult.logicalReference.id[0].attrs.value
    this.parseLogicalReference(parseResult)
    this.parseLogicalInstance(parseResult)
    this.parseLogicalFlowExpositionInstance(parseResult)
    this.treeData = this.array2Tree()
    this.drawFramework(this.rootLogicId);
  }


  public parseLogicalReference(parseResult: RFLP) {
    this.logicalReferenceList = parseResult.logicalReference.id.map((item) => {
      item.children = []
      item.id = item.attrs.value
      item.rawrefrence = null
      // 同时存储map方便获取
      this.logicalReferenceMap[item.id] = item
      item.label = item.vName.$text
      return item
    })


  }

 
  public parseLogicalInstance(parseResult: RFLP) {
    this.logicalInstanceList = parseResult.logicalInstance.id.map(item => {
      item.children = []
      item.id = item.attrs.value
      item.rawrefrence = null
      // 存储方便处理
      this.logicalInstanceMap[item.id] = item
      const label = item.vName?.$text || item.mandatory.plmExternalId.$text
      item.label = label
      return item
    })
  }

  public parseLogicalFlowExpositionInstance(parseResult: RFLP) {
    this.logicalFEInstanceList = parseResult.logicalFlowExpositionInstance.id.map(item => {
      item.children = []
      item.id = item.attrs.value
      item.rawrefrence = null
      this.logicalFEInstanceMap[item.id] = item
      return item
    })
  }




  /**
   * @description: 解析为树状结构
   * ownerReference => 关联所属父级对象
   * reference => 关联到架构对象
   * @return {*}
   */
  public array2Tree() {
    const rootLogical = this.logicalReferenceMap[this.rootLogicId];
    rootLogical.children = this.tree(this.rootLogicId);
    return [rootLogical];
  }

  public tree(rootId: string) {
    // 先找到子实例
    const childInstances = this.logicalInstanceList.filter(
      (instance) => instance.mandatory.relation.attrs.ownerReference === rootId
    );
    // 子实例归类
    for (const childInstance of childInstances) {
      const reference = childInstance.mandatory.relation.attrs.reference;
      const logical = this.logicalReferenceMap[reference];
      childInstance.children = this.tree(logical.id);
      childInstance.rawrefrence = logical;
    }
    return childInstances;
  }

  public drawFramework(rootId: string) {
    const logical = this.logicalReferenceMap[rootId] || this.logicalInstanceMap[rootId].rawrefrence
    const rootBox = this.transform2RectBox(logical.mandatory.boundingBox.attrs);
    this.graph.addNode({
      id: logical.id,
      x: rootBox.x,
      y: rootBox.y,
      width: rootBox.width,
      height: rootBox.height,
      label: logical.vName.$text,
    });
    this.drawChildFramework(rootId, rootBox)

  }

  public drawChildFramework(rootId: string, rootBox: Box, level = 1) {
    const childInstances =
      rootId === this.rootLogicId
        ? this.logicalReferenceList[0].children
        : this.logicalInstanceMap[rootId].children || [];

    for (const instanceItem of childInstances) {
      const instanceBox = this.transform2RectBox(instanceItem.mandatory.boundingBox.attrs);
      const label = instanceItem.vName?.$text || instanceItem.mandatory?.plmExternalId.$text
      if (level === 1) {
        // 当前子节点实例
        this.graph.addNode({
          id: instanceItem.id,
          x: instanceBox.x,
          y: instanceBox.y,
          width: instanceBox.width,
          height: instanceBox.height,
          label,
        });
        // 绘制第一层子节点时，取当前实例box 大小作为基准坐标系
        this.drawChildFramework(instanceItem.id, instanceBox, level + 1)
      } else {
        /**
         * 第二层绘图时需要将计算好的做实例盒子作为基准传下去
         */
        // 获取所属逻辑架原始框体数据
        const rootInstance = this.logicalInstanceMap[rootId]
        const logical = rootInstance.rawrefrence!
        const logicalBox = this.transform2RectBox(logical.mandatory.boundingBox.attrs)
        // 计算缩放比例
        const sx = rootBox.width / logicalBox.width
        const sy = rootBox.height / logicalBox.height
        const x = sx * (instanceBox.x - logicalBox.x) + rootBox.x
        const y = sy * (instanceBox.y - logicalBox.y) + rootBox.y
        const width = instanceBox.width * sx
        const height = instanceBox.height * sy
        this.graph.addNode({
          id: instanceItem.id,
          x,
          y,
          width,
          height,
          attrs: {
            body: {
              stroke: "red",
            },
          },
          label: label,
        });
        const parentBox = {
          x, y, width, height
        }
        this.drawChildFramework(instanceItem.id, parentBox, level + 1)
      }

    }
  }

  public transform2RectBox(boundingBox: BoundingBoxAttrs) {
    const scale = 4
    return {
      x: boundingBox.xMin * scale,
      y: boundingBox.yMax * scale,
      width: Math.abs(boundingBox.xMax - boundingBox.xMin) *scale,
      height: Math.abs(boundingBox.yMax - boundingBox.yMin) * scale,
    };
  }

  public getTreeData() {
    return this.treeData
  }
}
