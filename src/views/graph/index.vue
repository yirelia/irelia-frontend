<template>
  <div ref="testRef"></div>
</template>
<script setup lang="ts">
import { ref } from "vue";
const testRef = ref();
import toBeTxt from './files/toBe.txt?raw'
import { dfsSearch, readTinyG } from "./graph";
console.log(toBeTxt)
readTinyG()
  dfsSearch()
</script>
<style scoped lang="scss"></style>
