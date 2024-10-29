<template>
  <div class="graph-layout">
    <div class="x6-ref">
      <div ref="x6Instance" class="x6-graph"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Graph } from "@antv/x6/es";
import { onMounted, ref } from "vue";
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

  graph.addNode({
    x: -100,
    y: -100,
    width: 80,
    height: 80,
    shape: "image",
    attrs: {
      image: {
        href: "/img/沉淀池2.gif",
      },
    },
  });

  graph.addNode({
    x: 150,
    y: -100,
    width: 80,
    height: 80,
    shape: "image",
    attrs: {
      image: {
        href: "/img/罗茨风机.gif",
      },
    },
  });

  graph.addNode({
    x: 50,
    y: -20,
    width: 100,
    height: 100,
    shape: "path",
    attrs: {
      body: {
        stroke: "red",
        strokeWidth: 4,
        d: "M 100 0 L -100 0 L -100 -10",
      },
    },
  });

  graph.centerContent();
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
  height: 100%;
  width: 100%;
  .x6-graph {
    height: 100%;
    width: 100%;
  }
}
</style>
