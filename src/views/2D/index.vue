<!--
 * @Author: simtek/yangrui 17368465776@163.com
 * @Date: 2025-02-11 17:02:33
 * @LastEditors: simtek/yangrui 17368465776@163.com
 * @LastEditTime: 2025-02-13 19:36:38
 * @FilePath: \irelia-frontend\src\views\2D\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
  <div class="graph-layout">
    <div ref="x6Instance" class="x6-graph"></div>
  </div>
</template>
<script lang="ts" setup>
import { EdgeView, Graph } from "@antv/x6/es";
import { onMounted, ref } from "vue";

import { Rectangle } from "./orth/geometry/rectangle";
import { Point } from "./orth/geometry/point";
import { Line } from "./orth/geometry/line";
import { GridMap } from "./orth/grid-map";
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
    mousewheel: true,
    scaling: {
      min: 0.5,
      max: 10,
    },
    panning: true,
  });


const sourceRect = new Rectangle(400, 100, 100, 50)
const targetRect = new Rectangle(700, 200, 100, 50)


const source = graph.addNode({
  x: sourceRect.x,
  height: sourceRect.height,
  width: sourceRect.width,
  y: sourceRect.y,
})
const target = graph.addNode({
  x: targetRect.x,
  height: targetRect.height,
  width: targetRect.width,
  y: targetRect.y,
})

const computeSidePoint = (rect: Rectangle, side: string, distance = 0.5) => {
  switch(side){
        case "bottom": return new Point(rect.x + rect.width * distance, rect.bottom);
        case "top": return new Point(rect.x + rect.width * distance, rect.y);
        case "left": return new Point(rect.x, rect.y + rect.height * distance);
        case "right": return new Point(rect.right, rect.y + rect.height * distance);
        
        default: return new Point(rect.x + rect.width * distance, rect.bottom);
    }
}
const sourceSidePoint = computeSidePoint(sourceRect, "right")
const targetSidePoint = computeSidePoint(targetRect, "bottom")  

const sourceSidePointNode = graph.addNode({
  id: `sourceSidePoint`,
  x: sourceSidePoint.x - 5,
  y: sourceSidePoint.y - 5,
  width: 10,
  height: 10,
  shape:'circle',
  attrs: {
    body: {
      fill: 'red',
    },
  },
})

source.addChild(sourceSidePointNode)


const inflateSource = sourceRect.inflate(10, 10)
const inflateTarget = targetRect.inflate(10, 10)

graph.addNode({
  x: inflateSource.x,
  y: inflateSource.y,
  width: inflateSource.width,
  height: inflateSource.height,
  shape: 'rect',
  attrs: {
    body: {
      fill: 'transparent',
      stroke: 'red',
      strokeWidth: 2,
    },
  },
})
graph.addNode({
  x: inflateTarget.x,
  y: inflateTarget.y,
  width: inflateTarget.width,
  height: inflateTarget.height,
  shape: 'rect',
  attrs: {
    body: {
      fill: 'transparent',
      stroke: 'red',
      strokeWidth: 2,
    },
  },
})



const targetSidePointNode = graph.addNode({
  id: `targetSidePoint`,
  x: targetSidePoint.x - 5,
  y: targetSidePoint.y - 5,
  width: 10,
  height: 10,
  shape:'circle',
  attrs: {
    body: {
      fill: 'red',
    },
  },
})

target.addChild(targetSidePointNode)

const addRuleLayer = () => {
  const verticals: number[] = [];
  const horizontals: number[] = [];

  for(const box of [inflateSource, inflateTarget]) {
    verticals.push(box.x, box.right)
    horizontals.push(box.y, box.bottom)
  }
  
  // 找到链接点
  horizontals.push(sourceRect.center.y)
  verticals.push(targetRect.center.x)
  const vlines = verticals.sort((a, b) => a-b).map(item => {
    return new Line(new Point(item, 50), new Point(item, 400))
  })
  const hlines = horizontals.sort((a, b) => a-b).map(item => {
    return new Line(new Point(300, item, ), new Point(900, item))
  })


  // (sideAVertical ? verticals : horizontals).push(sideAVertical ? originA.x : originA.y);
  //   (sideBVertical ? verticals : horizontals).push(sideBVertical ? originB.x : originB.y);

  const lines = [...vlines, ...hlines]
  for(const line of lines) {
    const lineNode = graph.addNode({
      x: line.start.x,
      y: line.start.y,
      width: line.end.x - line.start.x,
      height: line.end.y - line.start.y,
      shape: 'path',
      attrs: {
        body: {
          stroke: 'black',
          strokeWidth: 1,
          strokeDasharray: `5 5`,
        },
      },
      path: `M ${line.start.x} ${line.start.y} L ${line.end.x} ${line.end.y}`,
    })
  }

  const gridMap = new GridMap()
return [verticals, horizontals]
}

const  [verticals, horizontals] = addRuleLayer()


const inflateBounds = inflateSource.union(inflateTarget).inflate(20, 20)
const boundsNode = graph.addNode({
  x: inflateBounds.x,
  y: inflateBounds.y,
  width: inflateBounds.width,
  height: inflateBounds.height,
  shape: 'rect',
  attrs: {
    body: {
      fill: 'transparent',
      stroke: 'blue',
      strokeWidth: 2,
    },
  },
  zIndex: -2
})

const map = new GridMap()
map.build(verticals, horizontals, inflateBounds, graph)


// const updateConnectPoint = () => {
//   const sourceBox = source.getBBox()
//   const targetBox = target.getBBox()
//   const sourceSidePoint = 
// }

// const sourceOriginPoint = 
graph.centerContent()

})


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
