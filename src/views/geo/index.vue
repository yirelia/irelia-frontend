<template>
  <div class="canvas-render" ref="x6Ref"></div>
</template>
<script setup lang="ts">
  import { Graph } from "@antv/x6";
  import { onMounted, ref } from "vue";
  import res from './res.json'
  import { Component } from '@/model-gui'
  const x6Ref = ref();
  console.log(res)
  // origin全部重制 （0. 0）
  const nodes = res.data.model.graphics.elements.model
  nodes.forEach(element => {
    element.origin = null
  });
  onMounted(() => {
    const graph = new Graph({
      container: x6Ref.value,
      panning: true,
      mousewheel: true,
    });

    nodes.forEach((el) => {
      const node = new Component(graph, el).createNode();
    })

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
    graph.centerContent();
  });
</script>
<style scoped>
.canvas-render {
  height: 100%;
  width: 100%;
}
</style>
