<template>
  <div>
    <el-upload :before-upload="handleChange" >
      <el-button>上传文件</el-button>
    </el-upload>
  </div>
  <div class="model-graph-wrap">
    <div class="model-tree">
      <el-tree :data="treeData" :props="treeProps" @node-click="handleNodeClick" ></el-tree>
    </div>
    <div ref="domRef" class="canvas-svg"></div>
  </div>
  
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Graph, Node as XNode } from "@antv/x6";
import { LogicalStructure } from "./logical";
import { UploadFile, UploadRawFile } from "element-plus";

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
const handleChange = async (uploadFile: UploadRawFile) => {
  graph.value?.clearCells();
  logicalInstan.value?.clear()
  await logicalInstan.value!.loadXml(uploadFile)
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
  treeData.value = logicalInstan.value?.logicalData
  graph.value!.centerContent()
  return true
};

const handleNodeClick = (data)=>  {
  graph.value?.clearCells()
  logicalInstan.value?.drawFramework(data.id)
  graph.value!.centerContent()
}
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
