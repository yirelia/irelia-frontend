<template>
  <div class="canvas-render" ref="x6Ref"></div>
</template>
<script setup lang="ts">
import { Graph } from "@antv/x6";
import { onMounted, ref } from "vue";
import { Component } from "./model-gui";
import { ViewType } from "./model-gui/enums";
import Switch from './switch.json'

const models = Switch.data.model.graphics.elements.model

const x6Ref = ref();

onMounted(() => {
  const graph = new Graph({
    container: x6Ref.value,
    panning: true,
    mousewheel: true,
  });



  for (const ge of models) {
    const parentComponent = new Component(graph, ge as any);
    const node = parentComponent.createNode();
    graph.addNode(node);
    for (const input of ge.connectors) {
      const inputComponet = new Component(
        graph,
        input as any,
        ViewType.Icon,
        parentComponent
      );
      const childNode = inputComponet.createNode();
      const cNode = graph.addNode(childNode);
      node.addChild(cNode);
    }
  }

  const point1 = {
    x: -20,
    y: -10
  }

  const point2 = {
    x: 20,
    y: 10
  }

  graph.addNode({
    markup: {
      tagName: 'rect',
      attrs: {
        x: -20,
        y: -10,
        stroke: 'blue',
        fill: 'none',
        strokeWidth: 2,
        width: 40,
        height: 20,
      },
    }
  })

  graph.addNode({
    zIndex: -1,
    markup: [
      {
        tagName: "path",
        attrs: {
          stroke: "red",
          strokeWidth: "2",
          d: "M-1000 0 L1000 0",
        },
      },
    ],
  });
  graph.addNode({
    zIndex: -1,
    markup: [
      {
        tagName: "path",
        attrs: {
          stroke: "red",
          strokeWidth: "2",
          d: "M0 -1000 L0 1000",
        },
      },
    ],
  });
  graph.centerContent();
});
</script>
<style scoped>
.canvas-render {
  height: 100%;
  width: 100%;
}
</style>
