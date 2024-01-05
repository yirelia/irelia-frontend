<template>
  <div>
    <el-upload action="#" :on-change="handleChange" >
      <el-button>上传文件</el-button>
    </el-upload>
  </div>
  <div class="model-graph-wrap">
    <div class="model-tree">
      <el-tree :data="treeData" :props="treeProps"></el-tree>
    </div>
    <div ref="domRef" class="canvas-svg"></div>
  </div>
  
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Graph, Node as XNode } from "@antv/x6";
import { LogicalStructure } from "./logical";
import { UploadFile } from "element-plus";

const domRef = ref();
const graph = ref<Graph>();
const treeData = ref([])
const treeProps = {
  label(data) {
    return `${data.VName || data.mandatory.PLM_ExternalID}_${data.id}`
  }
}

const  logicalInstan  = ref<LogicalStructure>()
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
  logicalInstan.value = new LogicalStructure(graph.value)
  graph.value?.addNode({
    zIndex: 9999,
    markup: [
      {
        tagName: 'path',
        attrs: {
          d : 'M-100 0, L100, 0',
          stroke: 'red'
        }
      },
      {
        tagName: 'path',
        attrs: {
          d : 'M0,-100 L0,100',
          stroke: 'red'
        }
      }
    ]
  })

  graph.value.centerContent()



};

onMounted(() => {
  initGraph();
});
const handleChange = async (uploadFile: UploadFile) => {
  graph.value?.clearCells();
  logicalInstan.value?.clear()
  await logicalInstan.value!.loadXml(uploadFile.raw!)
  graph.value?.addNode({
    zIndex: 9999,
    markup: [
      {
        tagName: 'path',
        attrs: {
          d : 'M-100 0, L100, 0',
          stroke: 'red'
        }
      },
      {
        tagName: 'path',
        attrs: {
          d : 'M0,-100 L0,100',
          stroke: 'red'
        }
      }
    ]
  })
  treeData.value = logicalInstan.value!.transform2Tree()
  graph.value!.centerContent()
};
</script>
<style lang="scss">
.canvas-svg {
 flex: 1;
}
.model-graph-wrap {
  display: flex;
  height: 100%;
  width: 100%;
}
.model-tree {
  width: 400px;

}
</style>
