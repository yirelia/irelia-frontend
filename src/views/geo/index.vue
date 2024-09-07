<template>
  <div class="canvas-render" style="height: 100%; width: 100%;">
    <div class="" ref="x6Ref"></div>
  </div>
</template>
<script setup lang="ts">
  import { Graph, Node } from "@antv/x6";
  import { onMounted, ref } from "vue";
  // import res from './res1.json'
  import res from './res.json'
  // import res1 from './res1.json'
  import { Component, ComponentEdge, ViewType } from '@/model-gui'
  import ELK from 'elkjs';
  import { HelixCurve } from "three/examples/jsm/curves/CurveExtras.js";

  const x6Ref = ref();
  console.log(res)
  // origin全部重制 （0. 0）
  const nodes = res.data.model.graphics.elements.model
  const nodesMap = new Map<string, any>()
  const connections = res.data.model.graphics.connections.model.map(el => {
    el.points = []
    return el
  })
  nodes.forEach(element => {
    element.origin = [0, 0]
    nodesMap.set(element.name, element)
  });
  onMounted(() => {
    const graph = new Graph({
      container: x6Ref.value,
      autoResize: true,
      panning: true,
      mousewheel: true,
      translating: { restrict: true },
    });
    const nodeMap = new Map<string, { node: Node, children: Node[] }>()
    const nodeIds = nodes.map(el => {
      const compt = new Component(graph, el)
      const node = compt.createNode()
      graph.addNode(node)
      const children = el.connectors.map(item => {
        const childNode = new Component(graph, item, ViewType.Icon, compt).createNode()
        graph.addNode(childNode)
        node.addChild(childNode)
        return childNode
      })
      nodeMap.set(node.id, {
        node,
        children: children
      })

      return node.id
    })
    const edges: any = []
    connections.forEach(el => {
      const edge = new ComponentEdge(graph, el).addEdge()
      if (edge) {
        const id = edge.id
        const source = edge.getSourceCellId()
        const target = edge.getTargetCellId()
        const e = {
          id: edge.id,
          sources: [source],
          targets: [target]
        }
        edges.push(e)
        graph.removeEdge(edge)
      }

    })
    console.log(`edges`, edges);
    const elk = new ELK()
    const elkGraph = {
      id: "root",
      width: 100,
      height: 100,
      layoutOptions: {
        "algorithm": "layered",
        // 'elk.algorithm': 'force',
        logging: true,
        "spacing.nodeNode": "10",
        "spacing.edgeNode": "10",
        // "spacing.nodeNodeBetweenLayers": "1"
      },
      children: nodeIds.map(id => {
        const node = graph.getCellById(id)! as Node
        const nodeSize = node.size()
        const children = (node.getChildren() || []) as Node[]
        // console.log(`children`, children);
        const ports = children.map(child => {
          const size = child.getSize()
          const position = child.position()
          let portSide = 'WEST';
          if (position.x <= 0) {
            portSide = 'WEST';
          } else if (position.x >= size.width) {
            portSide = 'EAST';
          } else if (position.y <= 0) {
            portSide = 'NORTH';
          } else if (position.y >= size.height) {
            portSide = 'SOUTH';
          }

          return {
            id: child.id,
            width: size!.width / 5,
            height: size!.height / 5,
            "properties": {
              "port.side": portSide,
            },
            // x: position.x,
            // y: position.y
          }
        })
        // console.log(`ports`, ports);
        return {
          id: id,
          width: nodeSize!.width,
          height: nodeSize!.height,
          ports: ports,
        }
      }),
      edges: edges,
      // connections.map(el => {
      //   // const source = `${el.lhs[0].name}_${el.lhs[1].name}`
      //   // const target = `${el.rhs[0].name}_${el.rhs[1].name}`
      //   const edge = new ComponentEdge(graph, el).addEdge()!
      //   debugger

      //   console.log(`source target`, source, target);

      //   return {
      //     id: edge.id,
      //     sources: [source],
      //     targets: [target]
      //   }
      // })
    }


    console.log(`elkGraph`, structuredClone(elkGraph));
    elk.layout(elkGraph).then((res) => {
      console.log(res)
      graph.clearCells()
      res.children?.forEach((child) => {
        // console.log(`child ${child.id} position`, child.x, child.y);
        // const centerX = (child.x - child.width) / 2
        // const centerY = (child.y - child.height) / 2
        const node = nodesMap.get(child.id)!
        const item = new Component(graph, structuredClone(node))
        const { x, y } = item.componentInfo.center
        node.origin = [(child.x - x) / 5, -(child.y - y) / 5]
        // graph.addNode({
        //   id: child.id,
        //   x: centerX,
        //   y: centerY,
        //   // position: {
        //   //   x: child.x,
        //   //   y: child.y
        //   // },
        //   size: {
        //     width: child.width,
        //     height: child.height
        //   }
        // })
      })



      nodes.map(el => {
        const compt = new Component(graph, el)
        const node = compt.createNode()
        graph.addNode(node)
        const children = el.connectors.map(item => {
          const childNode = new Component(graph, item, ViewType.Icon, compt).createNode()
          graph.addNode(childNode)
          node.addChild(childNode)
        })
      })

      connections.forEach(el => {
        const edge = new ComponentEdge(graph, el).addEdge()
        if (edge) {
          const id = edge.id
          const source = edge.getSourceCellId()
          const target = edge.getTargetCellId()
          const e = {
            id: edge.id,
            sources: [source],
            targets: [target]
          }
          // edges.push(e)
          // graph.removeEdge(edge)
        }

      })
      graph.centerContent()
    })
    // nodes.forEach((el) => {
    //   const node = new Component(graph, el).createNode();
    //   graph.addNode(node);
    // })

    graph.addNode({
      markup: [
        {
          tagName: "path",
          attrs: {
            stroke: "red",
            strokeWidth: "2",
            d: "M-10 0 L10 0",
          },
        },
      ],
    });
    graph.addNode({
      markup: [
        {
          tagName: "path",
          attrs: {
            stroke: "red",
            strokeWidth: "2",
            d: "M0 -10 L0 10",
          },
        },
      ],
    });
    graph.fitToContent()
  });
</script>
<style scoped>
.canvas-render {
  height: 100%;
  width: 100%;
}
</style>
