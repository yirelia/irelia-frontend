<template>
  <el-container>
    <el-aside width="300px"></el-aside>
    <el-main>
      <div ref="faultTreeRef"></div>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { Graph } from "@antv/x6";
import { onMounted, ref } from "vue";

const faultTreeRef = ref<HTMLElement>();
const graph = ref<Graph>();
onMounted(() => {
  graph.value = new Graph({
    container: faultTreeRef.value,
  });
});
</script>
