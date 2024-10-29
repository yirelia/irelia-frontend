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
import * as glMatrix from "gl-matrix";
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
  graph.addEdge({
    source: { x: -100, y: 0 },
    target: { x: 100, y: 0 },
  });

  graph.addEdge({
    source: { x: 0, y: -100 },
    target: { x: 0, y: 100 },
  });

  const box = {
    x: -100,
    y: -100,
    width: 100,
    height: 100,
  };
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  const ltx = x6Instance.value.offsetWidth / 2;
  const lty = x6Instance.value.offsetHeight / 2;

  const xFactor = x6Instance.value.offsetWidth / box.width;
  const yFactor = x6Instance.value.offsetHeight / box.height;

  const factor = Math.min(xFactor, yFactor);
  //   graph.scale(factor);

  graph.translate(ltx - cx, lty - cy);

  graph.addNode({
    id: "box-1",
    x: box.x,
    y: box.y,
    width: box.width,
    height: box.height,
  });

  //   graph.addNode({
  //     x: 100,
  //     y: 100,
  //     width: 100,
  //     height: 100,
  //     attrs: {},
  //   });

  // const matrix = new DOMMatrix()
  //   const rad = glMatrix.glMatrix.toRadian(45);

  //   const m1 = glMatrix.mat2d.create();
  //   const m2 = glMatrix.mat2d.create();
  //   const tm = glMatrix.mat2d.fromValues(1, 0, 0, 1, -50, -50);
  //   const rM = glMatrix.mat2d.create();
  //   glMatrix.mat2d.rotate(rM, rM, rad);
  //   const tm1 = glMatrix.mat2d.fromValues(1, 0, 0, 1, 50, 50);
  //   const sm = glMatrix.mat2d.fromValues(-1, 0, 0, 1, 0, 0);

  //   glMatrix.mat2d.multiply(m1, tm, m1);
  //   glMatrix.mat2d.multiply(m1, rM, m1);
  //   glMatrix.mat2d.multiply(m1, tm1, m1);
  //   glMatrix.mat2d.multiply(m1, sm, m1);
  //   console.log(m1);
  //   const mt = `matrix(${m1[0]}, ${m1[1]}, ${m1[2]}, ${m1[3]}, ${m1[4]}, ${m1[5]})`;

  //   graph.addNode({
  //     x: 100,
  //     y: 100,
  //     width: 100,
  //     height: 100,
  //     attrs: {
  //       body: {
  //         fill: "red",
  //         stroke: "blue",
  //         strokeWidth: 2,
  //         rx: 10,
  //         ry: 10,
  //         transform: mt,
  //       },
  //     },
  //   });

  //   graph.centerPoint(0, 0);
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
