import { convertMMToPixel } from "@/utils";
import { Graph } from "@antv/x6";
import { BoundingBox, Box, LogicalReference, Mandatory } from "./model";
const dpi = {
  v: 0,
  get: function (noCache: boolean) {
    if (noCache || dpi.v == 0) {
      const e = document.body.appendChild(document.createElement("DIV"));
      e.style.width = "1in";
      e.style.padding = "0";
      dpi.v = e.offsetWidth;
      e.parentNode?.removeChild(e);
    }
    return dpi.v;
  },
};

import { XMLParser } from "fast-xml-parser";

const screenDPI = dpi.get(true); // 重新计算DPI

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



interface Intance extends LogicalReference {
  PLM_ExternalID: string;
}

const DPI = 96;
export class LogicalStructure {
  private graph: Graph;
  public logicalData: LogicalReference[] = [];
  // 逻辑架构抽象接口
  private logicals: LogicalReference[] = [];
  public logicalMap: Record<string, LogicalReference> = {};

  // 逻辑架构实例
  public instances: LogicalReference[] = [];
  private instanceMap: Record<string, LogicalReference> = {};


  // 逻辑流参考
  public logicalFlow: LogicalReference[] = []
  public logicalFlowMap: Record<string, LogicalReference> = {};

  public  flowInstances: LogicalReference[] = []

  public flowInstanceMap:  Record<string, LogicalReference> = {};




  constructor(graph: Graph) {
    this.graph = graph;
  }

  public rootLogicId = "";

  public clear() {
    this.logicals = [];
    this.instances = [];
    this.logicalMap = {};
    this.instanceMap = {};
  }

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

    const xmlParser = new XMLParser()
    console.log(xmlParser.parse(xmlString))
    const RFLP = xmlParser.parse(xmlString).RFLP
  //   const dom = new DOMParser().parseFromString(xmlString, "text/xml");
  //   const logicalReferences: Element[] = (dom.querySelector("LogicalReference")
  //     ?.children || []) as Element[];
  //   this.parseLogicalReference(logicalReferences);
  //   const logicalInstances = (dom.querySelector("LogicalInstance")?.children ||
  //     []) as Element[];
  //   this.parseLogicalReference(logicalInstances, true);
  //   this.logicalData = this.transform2Tree();
  //   this.drawFramework(this.rootLogicId);
  }

  public parseLogicalReference(
    logicalReferences: Element[],
    isInstance = false
  ) {
    for (const lrchild of logicalReferences) {
      const mandatory = this.parseMandatory(lrchild);
      const id = lrchild.getAttribute("Value")!;
      const V_NameEl = lrchild.querySelector("V_Name");
      const VName = (V_NameEl?.textContent as string) || "";
      const type = this.parseReferenceType(lrchild);
      // 记录第一个rootId
      if (!this.rootLogicId) {
        this.rootLogicId = id;
      }

      const refrence: LogicalReference = {
        id,
        mandatory,
        VName,
        type,
      };
      // 此处将架构对象挂在到实例上
      if (isInstance) {
        this.instances.push(refrence);
        this.instanceMap[id] = refrence;
        // refrence.logicalReference = this.referenceMap[mandatory.relation!.reference]
      } else {
        this.logicals.push(refrence);
        this.logicalMap[id] = refrence;
      }
    }
  }

  public parseMandatory(referenceDom: Element): Mandatory {
    const boundingBoxEl = referenceDom.querySelector("BoundingBox")!;
    let XMin = boundingBoxEl?.getAttribute("XMin") || 0;
    let YMin = boundingBoxEl?.getAttribute("YMin") || 0;
    let XMax = boundingBoxEl?.getAttribute("XMax") || 0;
    let YMax = boundingBoxEl?.getAttribute("YMax") || 0;
    const releationEl = referenceDom.querySelector("Relation");
    const ownerReference = releationEl?.getAttribute("OwnerReference") || "";
    const reference = releationEl?.getAttribute("Reference") || "";
    const PLM_ExternalID =
      referenceDom?.querySelector("PLM_ExternalID")?.textContent || "";
    return {
      PLM_ExternalID,
      relation: {
        ownerReference,
        reference,
      },
      BoundingBox: {
        XMin: convertMMToPixel(Number(XMin)),
        XMax: convertMMToPixel(Number(XMax)),
        YMax: convertMMToPixel(Number(YMax)),
        YMin: convertMMToPixel(Number(YMin)),
      },
    };
  }

  public parseFlowMandatory() {}

  public parseReferenceType(referenceDom: Element): string {
    return referenceDom.getAttribute("Type")!;
  }

  /**
   * @description: 解析为树状结构
   * ownerReference => 关联所属父级对象
   * reference => 关联到架构对象
   * @return {*}
   */
  public transform2Tree() {
    const rootLogical = this.logicalMap[this.rootLogicId];
    rootLogical.children = this.tree(this.rootLogicId);
    return [rootLogical];
  }

  public tree(rootId: string) {
    // 先找到子实例
    const childInstances = this.instances.filter(
      (instance) => instance.mandatory.relation?.ownerReference === rootId
    );
    for (const childInstance of childInstances) {
      const reference = childInstance.mandatory.relation!.reference;
      const logical = this.logicalMap[reference];
      childInstance.children = this.tree(logical.id);
      childInstance.logicalReference = logical;
    }
    return childInstances;
  }

  /**
   * @description:
   * @return {*}
   */
  public parseLogicalFlowReference(doc:Document) {
    const logicalFlowReference: Element[] = (doc.querySelector("LogicalFlowReference")
      ?.children || []) as Element[];
      for (const lrchild of logicalFlowReference) {
        const mandatory = this.parseMandatory(lrchild);
        // 解析 ID
        const id = lrchild.getAttribute("Value")!;
        const V_NameEl = lrchild.querySelector("V_Name");
        const VName = (V_NameEl?.textContent as string) || "";
        const type = this.parseReferenceType(lrchild);
        // 记录第一个rootId
        if (!this.rootLogicId) {
          this.rootLogicId = id;
        }
  
        const refrence: LogicalReference = {
          id,
          mandatory,
          VName,
          type,
        };
        // 此处将架构对象挂在到实例上
        if (isInstance) {
          this.instances.push(refrence);
          this.instanceMap[id] = refrence;
          // refrence.logicalReference = this.referenceMap[mandatory.relation!.reference]
        } else {
          this.logicals.push(refrence);
          this.logicalMap[id] = refrence;
        }
      }
    
  }

  public parse

  /**
   * @description: 解析连线
   * @return {*}
   */
  public parseLogicalConnection() {}

  /**
   * @description:
   * @return {*}
   */

  public drawFramework(rootId: string) {
    const logical = this.logicalMap[rootId] || this.instanceMap[rootId].logicalReference
    const rootBox = this.getRectBox(logical.mandatory.BoundingBox);
    this.graph.addNode({
      id: logical.id,
      x: rootBox.x,
      y: rootBox.y,
      width: rootBox.width,
      height: rootBox.height,
      label: logical.VName,
    });
    this.drawChildFramework(rootId, rootBox)

  }

  public drawChildFramework(rootId: string, rootBox: Box, level = 0 ) {
    const childInstances =
    rootId === this.rootLogicId
      ? this.logicalData[0].children
      : this.instanceMap[rootId].children || [];

    for (const instanceItem of childInstances) {
      const instanceBox = this.getRectBox(instanceItem.mandatory.BoundingBox);
      if (level === 0) {
        // 当前子节点实例
        this.graph.addNode({
          id: instanceItem.id,
          x: instanceBox.x,
          y: instanceBox.y,
          width: instanceBox.width,
          height: instanceBox.height,
          label: instanceItem.mandatory.PLM_ExternalID,
        });
        this.drawChildFramework(instanceItem.id, instanceBox ,level + 1)
      } else {
        console.log('[info]', rootId, level, instanceItem.mandatory.relation)
        // 获取所属逻辑架原始框体数据
        const rootInstance = this.instanceMap[rootId]
        const logical = rootInstance.logicalReference!
        const logicalBox = this.getRectBox(logical.mandatory.BoundingBox)
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
            label: instanceItem.mandatory.PLM_ExternalID,
        });
        const parentBox = {
            x,y, width, height
        }
        this.drawChildFramework(instanceItem.id, parentBox ,level + 1)
      }
      
    }
  }

  public getRectBox(boundingBox: BoundingBox) {
    return {
      x: boundingBox.XMin,
      y: -boundingBox.YMax,
      width: Math.abs(boundingBox.XMax - boundingBox.XMin),
      height: Math.abs(boundingBox.YMax - boundingBox.YMin),
    };
  }


  public getCenter(boundingBox: BoundingBox) {
    return {
      x: (boundingBox.XMin + boundingBox.XMax) / 2,
      y: -(boundingBox.YMax + boundingBox.YMin) / 2,
    };
  }
}
