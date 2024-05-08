<template>
  <div ref="testRef"></div>
</template>
<script setup lang="ts">
import { ref } from "vue";
// import init from './uf'
import { bfsSearch } from "./search";
const testRef = ref();
import { initEWD} from './graph/edge-graph'
// import toBeTxt from './files/toBe.txt?raw'
// import { dfsSearch, readTinyG } from "./graph";
// console.log(toBeTxt)
// readTinyG()
// dfsSearch()
// init()

// bfsSearch()
initEWD()
</script>
<style scoped lang="scss"></style>
