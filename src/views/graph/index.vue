<template>
  <div ref="testRef">
    <el-space direction="vertical">
      <el-button @click="printGraph">打印图数据</el-button>
      <el-button @click="printDiagraph">打印dir图数据</el-button>
      <!-- <el-divider></el-divider> -->
      <br>
      <el-button @click="depSearch">深度优先搜索</el-button>
      <el-button @click="pathTo">深度优先路径</el-button>
      <el-button @click="breadPathTo">广度优先路径</el-button>
      <el-button @click="prinCcc">深度递归连通分量</el-button>
      <el-button @click="testDirectDFPaths">深度递归连通分量</el-button>
      <el-button @click="hasCycle">图是否有环</el-button>
    </el-space>

  </div>
</template>
<script setup lang="ts">
import {printGraph, printDiagraph} from '@/graphs/graph'
 import{depSearch} from '@/graphs/search'
 import {pathTo, breadPathTo, prinCcc, testDirectDFPaths,hasCycle} from '@/graphs/paths'
</script>
<style scoped lang="scss"></style>
