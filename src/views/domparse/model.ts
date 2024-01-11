import { resolveTypeElements } from "vue/compiler-sfc";

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Attrs {
  [index: string]: any;
}

export interface BoundingBoxAttrs extends Attrs {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
}

export interface TagAttrs extends Attrs {
  type: string;
}

export interface ReferenceAttrs extends Attrs {
  value: string;
  type: string;
}
export interface RelationAttrs extends Attrs {
  ownerReference: string;
  reference: string;
}

export interface PositionSize {
  attrs: {
    instanceId: string;
    x:  number;
    y:  number;
    size: number;
  };
}

export interface RFLPItem {
  id: string;
  mandatory: {
    plmExternalId: {
      $text: string;
      attrs: {
        type: string;
      };
    };
    boundingBox: {
      attrs: BoundingBoxAttrs;
    };
    relation: {
      attrs: RelationAttrs;
    };
    positionSize?: PositionSize[];
  };
  vName: {
    $text: string;
    attrs: TagAttrs;
  };
  revision: {
    $text: "A";
    attrs: TagAttrs;
  };
  originated: {
    $text: "10/04/22 :: 06:10:10 下午";
    attrs: {
      type: "Date";
    };
  };
  policy: {
    $text: string;
    attrs: {
      type: string;
    };
  };
  modified: {
    $text: string;
    attrs: {
      type: string;
    };
  };
  current: {
    $text: string;
    attrs: {
      type: string;
    };
  };
  owner: {
    $text: string;
    attrs: {
      type: "String";
    };
  };
  organization: {
    $text: "Company Name";
    attrs: {
      type: "String";
    };
  };
  project: {
    $text: "Common Space";
    attrs: {
      type: "String";
    };
  };
  name: {
    $text: "log-94757377-00000025";
    attrs: {
      type: "String";
    };
  };
  textGraphicProperties: {
    displayName: "TRUE";
  };
  label: string;
  attrs: ReferenceAttrs;
  children: RFLPItem[];
  rawrefrence: RFLPItem | null;
  ports: RFLPItem[];
}

export enum LogicalType {}

export interface Mandatory {}

export interface RFLP {
  logicalReference: {
    id: RFLPItem[];
  };
  logicalInstance: {
    id: RFLPItem[];
  };
  logicalFlowExpositionInstance: {
    id: RFLPItem[];
  };
  logicalConnection: {
    id: RFLPItem[];
  };
}

// export interface LogicalReference {
//   id: string, // 类型
//   vName: string // 名称
//   boundingBox: BoundingBox, // 盒子大小
//   type: string // 类型
// }
