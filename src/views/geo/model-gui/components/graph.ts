import { ViewType } from '../enums';
import { Component } from './component';
import { map } from 'lodash-es';
// import ELK from 'elkjs/lib/elk.bundled.js'

// export class ElkGraph {
//   private models: Map<string, Component> = new Map<string, Component>();
//   private rootIds: string[] = [];
//   private edges = [];

//   constructor(graph: any, elements: any[], edges: any[]) {
//     this.preprocess(graph, elements, edges);
//   }

//   public preprocess(graph, elements, edges) {
//     this.preprocessComps(graph, elements);
//     this.preprocessEdges(edges);
//   }

//   private preprocessComps(graph, elements) {
//     elements.forEach(element => {
//       element.origin = [0, 0];
//       const component = new Component(graph, element);
//       this.models.set(component.getComponentId(), component);
//       this.rootIds.push(component.getComponentId());
//       element.connectors.forEach(connector => {
//         const connectCompt = new Component(
//           graph,
//           connector,
//           ViewType.Icon,
//           component
//         );
//         this.models.set(
//           connectCompt.getComponentId().split('.').join('@'),
//           connectCompt
//         );
//       });
//     });
//   }

//   public preprocessEdges(edges) {
//     this.edges = edges
//       .map(edge => {
//         const sourceId = map(edge.lhs, 'name').join('@');
//         const targetId = map(edge.rhs, 'name').join('@');
//         const source = this.getEdgeConnecter(sourceId);
//         const target = this.getEdgeConnecter(targetId);
//         if (source.connecter && target.connecter) {
//           return {
//             sources: [source.connecterId],
//             targets: [target.connecterId],
//             id: `${source.connecterId}|${target.connecterId}`
//           };
//         }
//         return undefined;
//       })
//       .filter(edge => !!edge);
//   }

//   private getEdgeConnecter(connecterId: string) {
//     let connecter = this.models.get(connecterId);
//     if (!connecter) {
//       connecter = this.getIOConnectCell(connecterId);
//       if (connecterId.includes('@')) {
//         connecterId = connecterId.split('@')[0];
//       }
//     }
//     return {
//       connecter,
//       connecterId
//     };
//   }

//   public getIOConnectCell(ioCellId: string) {
//     const connecter = this.models.get(ioCellId);
//     if (connecter) {
//       return connecter;
//     }
//     if (!ioCellId?.includes('.')) {
//       return undefined;
//     }
//     //const parentId = ioCellId.split('@')[0];
//     //const element = this.models.get(parentId);
//     // if (element?.componentInfo.restriction?.includes('connector')) {
//     //   return element;
//     // }
//     return undefined;
//   }

//   private getLayoutBox() {
//     const boxs: Record<string, any> = {};
//     this.models.forEach((model, id) => {
//       const { width, height, x, y } = model.componentInfo;
//       if (!model.parentComponent) {
//         if (!boxs[id]) {
//           boxs[id] = {
//             id,
//             width,
//             height,
//             ports: [],
//             layoutOptions: {
//               portConstraints: 'FIXED_SIDE'
//             }
//           };
//         }
//       } else {
//         const parentId = model.parentComponent.getComponentId();
//         let pBox = boxs[parentId];
//         if (!pBox) {
//           const { width, height } = model.parentComponent.componentInfo;
//           pBox = boxs[parentId] = {
//             id: parentId,
//             width,
//             height,
//             ports: [],
//             layoutOptions: {
//               portConstraints: 'FIXED_SIDE'
//             }
//           };
//         }
//         const position = model.getNodePosition();
//         let portSide;
//         if (position.x <= x - pBox.width / 2) {
//           portSide = 'EAST';
//         } else if (position.x >= x + pBox.width / 2) {
//           portSide = 'WEST';
//         } else if (position.y <= y - pBox.height / 2) {
//           portSide = 'SOUTH';
//         } else if (position.y >= y + pBox.height / 2) {
//           portSide = 'NORTH';
//         }
//         if (portSide) {
//           boxs[parentId].ports.push({
//             id,
//             width,
//             height,
//             layoutOptions: {
//               'port.side': portSide
//             }
//           });
//         }
//       }
//     });
//     return Object.keys(boxs).map(key => boxs[key]);
//   }

//   public layout() {
//     const elk = new ELK();
//     const options = {
//       id: 'root',
//       children: this.getLayoutBox(),
//       edges: this.edges
//     };
//     return elk.layout(options);
//   }
// }

export const a = 0