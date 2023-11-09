<template>
  <div>
    <el-upload action="#" :before-upload="handleChange">
      <el-button>上传文件</el-button>
    </el-upload>
  </div>
  <div ref="domRef" class="canvas-svg"></div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Graph, Node as XNode } from "@antv/x6";

const domRef = ref();
const graph = ref<Graph>();
const initGraph = () => {
  if (!graph.value) {
    graph.value = new Graph({
      container: domRef.value,
      panning: true,
      mousewheel: {
        enabled: true,
        global: true,
        modifiers: ["ctrl", "meta"],
      },
      background: {
        color: "#F2F7FA",
      },
    });
  }
};

onMounted(() => {
  initGraph();
});
const handleChange = (uploadFile: File) => {
  graph.value?.clearCells();
  const reader = new FileReader();
  reader.readAsText(uploadFile);
  const nodeMap = new Map<string, XNode>();
  reader.onloadend = function () {
    const dom = new DOMParser().parseFromString(
      reader.result as string,
      "text/xml"
    );

    const logicalReferences =
      dom.getElementsByTagName("LogicalReference")[0].children;
    const nodes = [];

    for (const lrchild of logicalReferences) {
      const boundingBoxEl = lrchild.querySelector("BoundingBox")!;
      const V_NameEl = lrchild.querySelector("V_Name");
      const XMin = boundingBoxEl.getAttribute("XMin");
      const YMin = boundingBoxEl.getAttribute("YMin");
      const XMax = boundingBoxEl.getAttribute("XMax");
      const YMax = boundingBoxEl.getAttribute("YMax");
      const width = Number(XMax) - Number(XMin);
      const height = Number(YMax) - Number(YMin);
      const x = Number(XMin);
      const y = Number(YMin);
      const label = V_NameEl?.textContent;
      const id = lrchild.getAttribute("Value")!;
      // nodes.push({
      //   id,
      //   x,
      //   y: -y,
      //   width,
      //   height,
      //   label,
      //   attrs: {},
      // });
      const parentNode = {
        id,
        x,
        y: -y,
        width,
        height,
        label: `${id} ${label} ,
                x: ${x} y:${y} 
                width: ${width} height: ${height}
                `,
        attrs: {},
      };

      nodeMap.set(id, graph.value?.addNode(parentNode)!);
    }
    // graph.value?.addNodes(nodes);
    // const instanceNodes = [];
    // LogicalInstance
    const logicalInstanceEl =
      dom.getElementsByTagName("LogicalInstance")[0].children;

    for (const lrchild of logicalInstanceEl) {
      const boundingBoxEl = lrchild.querySelector("BoundingBox")!;
      const PLM_ExternalIDEl = lrchild.querySelector("PLM_ExternalID");
      const RelationEl = lrchild.querySelector("Relation");
      const OwnerReferenceId = RelationEl?.getAttribute("OwnerReference")!;
      const parnetId = RelationEl?.getAttribute("Reference")!;
      const XMin = boundingBoxEl.getAttribute("XMin");
      const YMin = boundingBoxEl.getAttribute("YMin");
      const XMax = boundingBoxEl.getAttribute("XMax");
      const YMax = boundingBoxEl.getAttribute("YMax");

      const width = Number(XMax) - Number(XMin);
      const height = Number(YMax) - Number(YMin);
      const x = Number(XMin);
      const y = Number(YMin);
      const label = PLM_ExternalIDEl?.textContent;
      const instanceNode = {
        x,
        y: -y,
        width,
        height,
        label: `Reference:${parnetId} OwnerReferenceId:${OwnerReferenceId} ${label}`,
        attrs: {
          body: {
            stroke: "red",
            strokeWidth: 1,
          },
        },
      };
      // instanceNodes.push();
      const gNode = graph.value?.addNode(instanceNode)!;
      nodeMap.get(parnetId)?.addChild(gNode);
    }
    // graph.value?.addNodes(instanceNodes);
  };
};
</script>
<style lang="scss">
.canvas-svg {
  width: 100%;
  height: 100%;
}
</style>
