<template>
  <div class="graph-layout">
    <div ref="x6Instance" class="x6-graph"></div>
  </div>
</template>
<script lang="ts" setup>
import { EdgeView, Graph, Point } from "@antv/x6/es";
import { onMounted, ref } from "vue";
import {OrthogonalConnector} from  './orth'
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

  const sourceBox = {
    x: 100,
    y: 100,
    width: 100,
    height: 50
  }

  const targetBox = {
    x: 300,
    y: 100,
    width: 100,
    height: 50
  }

  const source = graph.addNode({
    x: sourceBox.x,
    height: sourceBox.height,
    width: sourceBox.width,
    y: sourceBox.y,
  })

  const target = graph.addNode(targetBox)

// Define shapes
const shapeA = {left: sourceBox.x,  top: sourceBox.y, width: sourceBox.width, height: sourceBox.height};
const shapeB = {left: targetBox.x, top: targetBox.y, width: targetBox.width, height: targetBox.height};

// Get the connector path
const path = OrthogonalConnector.route({
    pointA: {shape: shapeA, side: 'left', distance: 0.5},
    pointB: {shape: shapeB, side: 'right',  distance: 0.5},
    shapeMargin: 10,
    globalBoundsMargin: 100,
    globalBounds: {left: 0, top: 0, width: 500, height: 500},
});

const sourcePort = graph.addNode({
  x: sourceBox.x - 20,
  y: sourceBox.y + sourceBox.height * 0.5 - 10,
  width: 20,
  height: 20,
  attrs: {
    body: {
      fill: 'red',
      stroke: 'black',
      strokeWidth: 1
    }
  }
})

const targetPort = graph.addNode({
  x: targetBox.x + targetBox.width,
  y: targetBox.y + targetBox.height * 0.5 - 10,
  width: 20,
  height: 20,
  attrs: {
    body: {
      fill: 'red',
      stroke: 'black',
      strokeWidth: 1
    }
  }
})

source.addChild(sourcePort)
target.addChild(targetPort)

const archOrth = ( _vertices: Point.PointLike[],
  _args: any,
  view: EdgeView,) => {

  const sourceBox = view.sourceBBox
  const targetBox = view.targetBBox
  const shapeA = {left: sourceBox.x,  top: sourceBox.y, width: sourceBox.width, height: sourceBox.height};
  const shapeB = {left: targetBox.x, top: targetBox.y, width: targetBox.width, height: targetBox.height};
  const path = OrthogonalConnector.route({
      pointA: {shape: shapeA, side: 'left', distance: 0.5},
      pointB: {shape: shapeB, side: 'right',  distance: 0.5},
      shapeMargin: 10,
      globalBoundsMargin: 10,
      globalBounds: {left: 0, top: 0, width: 500, height: 500},
  });
  return path
}

Graph.registerRouter('archOrth', archOrth)


graph.addEdge({
  source: sourcePort,
  target: targetPort,
  vertices: path,
  router: {
    name: 'archOrth',
    args: {
      // padding: 1
    }
  },
  attrs: {
    line: {
      targetMarker: null
    }
  }
})
console.log(path)


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
.x6-graph {
    height: 100%;
    width: 100%;
  }
</style>
