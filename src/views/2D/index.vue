<template>
  <div class="graph-layout">
    <div class="left-panel"></div>
    <div class="x6-ref">
      <div ref="x6Instance" class="x6-graph"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Graph } from "@antv/x6/es";
import { onMounted, ref } from "vue";
import svg1 from "@/assets/svg/image1.svg?url";
import svg2 from "@/assets/svg/image2.svg?url";
import svg3 from "@/assets/svg/image3.svg?url";
import svg4 from "@/assets/svg/image4.svg?url";

const x6Instance = ref();

onMounted(() => {
  const graph = new Graph({
    container: x6Instance.value,
    grid: true,
    background: {
      color: "#f0f0f0",
    },
    translating: {
      restrict: true,
    },
    scaling: {
      min: 0.5,
      max: 2,
    },
    panning: true,
  });

  const positions = [
    { x: -150, y: -150 },
    { x: 150, y: -150 },
    { x: -150, y: 150 },
    { x: 150, y: 150 },
  ];

  const svgs = [svg1, svg2, svg3, svg4];

  positions.forEach((pos, index) => {
    graph.addNode({
      id: `svg-${index + 1}`,
      shape: "image",
      x: pos.x,
      y: pos.y,
      width: 100,
      height: 100,
      imageUrl: svgs[index],
    });
  });

  const edges = [
    { source: "svg-1", target: "svg-2" },
    { source: "svg-2", target: "svg-4" },
    { source: "svg-4", target: "svg-3" },
    { source: "svg-3", target: "svg-1" },
  ];

  edges.forEach((edge) => {
    // 背景边
    graph.addEdge({
      source: { cell: edge.source },
      target: { cell: edge.target },
      attrs: {
        line: {
          stroke: "#907e7e",
          strokeWidth: 4,
          targetMarker: {
            name: "block",
            size: 2,
          },
        },
      },
    });
    // 流动边
    graph.addEdge({
      source: { cell: edge.source },
      target: { cell: edge.target },
      attrs: {
        line: {
          stroke: "#4ae592",
          strokeWidth: 2,
          targetMarker: {
            name: "block",
            width: 12,
            height: 10,
            fill: "#907e7e",
            stroke: "#907e7e",
          },
          strokeDasharray: 5,
          strokeDashoffset: 0,
          style: {
            animation: "dash-animation 2s linear infinite",
          },
        },
      },
    });
  });
});
</script>

<style lang="scss" scoped>
.graph-layout {
  height: 100%;
  width: 100%;
  display: flex;
  .left-panel {
    width: 200px;
    height: 100%;
    background: red;
  }
}

.x6-ref {
  width: 800px;
  height: 1000px;
  .x6-graph {
    height: 100%;
    width: 100%;
  }
}
</style>
<style>
@keyframes dash-animation {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: -100;
  }
}

@keyframes flow-line {
  to {
    stroke-dashoffset: -1000;
  }
}
</style>
