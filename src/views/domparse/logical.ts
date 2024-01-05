import { convertMMToPixel } from "@/utils";
import { Graph } from "@antv/x6"

const dpi = {
    v: 0,
    get: function (noCache: boolean) {
       if (noCache || dpi.v == 0) {
          const e = document.body.appendChild(document.createElement('DIV'));
          e.style.width = '1in';
          e.style.padding = '0';
          dpi.v = e.offsetWidth;
          e.parentNode?.removeChild(e);
       }
       return dpi.v;
    }
 }
 
 const screenDPI = dpi.get(true);  // 重新计算DPI



Graph.registerNode(
    'Block', //定义名称
    {
      inherit: 'rect', //继承的基类
      width: 160,
      height: 130,
      data: {
        parent: true
      },
      markup: [
        {
          tagName: 'rect',
          selector: 'body-rect'
        },
        {
          tagName: 'rect',
          selector: 'name-rect'
        },

        {
          tagName: 'text',
          selector: 'type'
        },
        {
          tagName: 'text',
          selector: 'name'
        }
      ],
      attrs: {
        //定制样式
        rect: {
          refWidth: '100%'
        },
        'name-rect': {
          strokeWidth: 1,
          stroke: '#5F95FF',
          fill: '#EFF4FF',
          height: 30,
          zIndex: 10000
        },
        'body-rect': {
          fill: '#eff4ff',
          stroke: '#000',
          strokeWidth: 0.5,
          refHeight: '100%',
          zIndex: 1
        },
        type: {
          ref: 'name-rect',
          text: '',
          refX: 0.5,
          refY: 0.3,
          fill: '#ACB9D9',
          fontFamily: 'MiSans',
          fontSize: 10,
          cursor: 'pointer'
        },
        name: {
          ref: 'name-rect',
          text: '',
          refX: 0.5,
          refY: 0.8,
          fill: '#000000',
          fontFamily: 'MiSans',
          fontSize: 10,
          cursor: 'pointer'
        }
      }
    },
    true
  );

  interface Box {
    x: number,
    y: number,
    width: number,
    height: number
  }

interface BoundingBox {
    XMin: number,
    YMin: number,
    XMax: number,
    YMax: number
}
interface Mandatory {
    PLM_ExternalID: string,
    V_Identifier?: string,
    V_Direction?: string,
    relation?: {
        ownerReference: string,
        reference: string
    },
    BoundingBox: BoundingBox
}
interface LogicalReference {
    id: string,
    mandatory: Mandatory
    VName: string,
    children?: LogicalReference[],
    type: string
}

interface Intance extends LogicalReference {
    PLM_ExternalID: string
}

const DPI = 96
export class LogicalStructure {

    private references: LogicalReference[] = []

    private referenceMap: Record<string, LogicalReference> ={}

    private graph: Graph

    constructor(graph: Graph) {
        this.graph = graph
    }

    public rootLogicId = ''

    public clear() {
       this.references = []
       this.referenceMap = {}
    }

    public async loadXml(xmlFile: File) {
        const xmlString = await this.file2String(xmlFile)
        this.parseXml(xmlString)

    }

    public file2String(file: File): Promise<string> {
        return new Promise((reslove, reject) => {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onloadend = () => {
                reslove(reader.result as string)
            }
            reader.onerror = (err) => reject(err)
        })
    }

    public parseXml(xmlString: string) {
        const dom = new DOMParser().parseFromString(
            xmlString,
            "text/xml"
        );

        const logicalReferences: Element[] = (dom.querySelector("LogicalReference")?.children || []) as Element[];
        this.parseLogicalReference(logicalReferences)


        const logicalInstances = (dom.querySelector('LogicalInstance')?.children || []) as Element[]
        this.parseLogicalReference(logicalInstances)
        this.draw()
    }

    public parseLogicalReference(logicalReferences: Element[]) {
        for (const lrchild of logicalReferences) {
            const mandatory = this.parseMandatory(lrchild)
            const id = lrchild.getAttribute("Value")!;
            const V_NameEl = lrchild.querySelector("V_Name");
            const VName = V_NameEl?.textContent as string || '';
            const type = this.parseReferenceType(lrchild)
            // 记录第一个rootId
            if (!this.rootLogicId) {
                this.rootLogicId = id
            }
            const refrence = {
                id,
                mandatory,
                VName,
                type
            }
            this.references.push(refrence)
            this.referenceMap[id] = refrence
        }
    }

    public parseMandatory(referenceDom: Element): Mandatory {
        const boundingBoxEl = referenceDom.querySelector("BoundingBox")!;
        let XMin = boundingBoxEl.getAttribute("XMin");
        let YMin = boundingBoxEl.getAttribute("YMin");
        let XMax = boundingBoxEl.getAttribute("XMax");
        let YMax = boundingBoxEl.getAttribute("YMax");
        const releationEl = referenceDom.querySelector("Relation")
        const ownerReference = releationEl?.getAttribute('OwnerReference') || ''
        const reference = releationEl?.getAttribute('Reference') || ''
        const PLM_ExternalID = referenceDom?.querySelector('PLM_ExternalID')?.textContent || ''
        return {
            PLM_ExternalID,
            relation: {
                ownerReference,
                reference
            },
            BoundingBox: {
                XMin: convertMMToPixel(Number(XMin)),
                XMax: convertMMToPixel(Number(XMax)),
                YMax: convertMMToPixel(Number(YMax)),
                YMin: convertMMToPixel(Number(YMin))
            }
        }

    }

    public parseReferenceType(referenceDom: Element): string {
        return referenceDom.getAttribute('Type')!
    }
    
    public transform2Tree() {
    
       const instances = this.references.filter(item => item.type === 'RFLVPMLogicalInstance')
       for(const instance of instances) {
        const {ownerReference, reference} = instance.mandatory.relation!
        let children = this.referenceMap[ownerReference].children
        if(!children) {
            children = this.referenceMap[ownerReference].children = []
        }
        const logicalReference = this.referenceMap[reference]
        children.push(logicalReference)
       }       
        return [this.referenceMap[this.rootLogicId]]
    }

    /**
     * @description: 
     * @return {*}
     */    
    public parseLogicalFlowReference() {}


    /**
     * @description: 解析连线
     * @return {*}
     */    
    public parseLogicalConnection() {

    }



    public draw() {

        const logicalReference = this.referenceMap[this.rootLogicId]
        const childRefrences = this.getChildRefrences(this.rootLogicId)
        const lrRectBox = this.getRectBox(logicalReference.mandatory.BoundingBox)
        // 父级顶层节点
        this.graph.addNode({
            id: logicalReference.id,
            x: lrRectBox.x,
            y: lrRectBox.y,
            width: lrRectBox.width,
            height: lrRectBox.height
        })
        // 处理子节点
        for(const instanceItem of childRefrences) {
            // 逻辑架构实例
            const lrRectBox = this.getRectBox(instanceItem.mandatory.BoundingBox)
            this.graph.addNode({
                id: instanceItem.id,
                x: lrRectBox.x,
                y: lrRectBox.y,
                width: lrRectBox.width,
                height: lrRectBox.height
            })
            // 找到原始逻辑架构
            const logicalRefrence = instanceItem.mandatory.relation!.reference
            const logicalReference = this.referenceMap[logicalRefrence]
            const logicalReferenceBox = this.getRectBox(logicalReference.mandatory.BoundingBox)
            // 计算缩放比例
            const sx = lrRectBox.width / logicalReferenceBox.width
            const sy = lrRectBox.height / logicalReferenceBox.height
            const childRefrences = this.getChildRefrences(logicalRefrence)
            this.drawChildInstance(childRefrences, logicalReferenceBox, sx, sy, lrRectBox)
    
        }

    }

    public drawBoxs() {

    }

    public drawChildInstance(instanceReferences: LogicalReference[], ownerLogicalBox: Box, sx: number, sy: number, ownerInstanceLogicalBox:Box ) {
        for(const instanceReference of instanceReferences) {
            const viewBox = this.getRectBox(instanceReference.mandatory.BoundingBox)
            const x = sx * (viewBox.x - ownerLogicalBox.x) + ownerInstanceLogicalBox.x
            const y = sy * (viewBox.y - ownerLogicalBox.y) + ownerInstanceLogicalBox.y
            const width  = viewBox.width * sx
            const height = viewBox.height * sy
            this.graph.addNode({
                id: instanceReference.id,
                x,
                y,
                width, 
                height,
                attrs: {
                    'body': {
                        stroke: 'red'
                    }
                }
            })
        }
    }



    public getChildRefrences(ownerReference: string) {
        return this.references.filter(item => {
            return item.type === 'RFLVPMLogicalInstance' && item.mandatory.relation?.ownerReference === ownerReference
        })
    }


    public getRectBox(boundingBox: BoundingBox) {
        return {
            x: boundingBox.XMin,
            y: -boundingBox.YMax,
            width: Math.abs(boundingBox.XMax - boundingBox.XMin),
            height: Math.abs(boundingBox.YMax - boundingBox.YMin)

        }
    }


    public getCenter(boundingBox: BoundingBox) {
      return {
            x: (boundingBox.XMin + boundingBox.XMax) / 2,
            y: -(boundingBox.YMax + boundingBox.YMin) / 2
        }
    }
}