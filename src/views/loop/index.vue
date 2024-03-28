<template>
  <div ref="testRef">
    <el-button @click="start"> start</el-button>
    <el-button @click="forStart"> forStart</el-button>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import items from "./a.json";
const testRef = ref();

const process1 = (item) => {
  // 1. 获取当前时间
  console.log(`[info] ${item}`);
};

function forStart() {
  console.time("for start");
  for (const item of items) {
    console.log(item);
  }
  console.timeEnd("for start");
}

function start() {
  // const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  let iterations = Math.ceil(items.length / 8);
  let startAt = items.length % 8;
  console.log(`startAt ${startAt}`);
  let i = 0;
  console.time("batch start");
  do {
    switch (startAt) {
      case 0:
        process1(items[i++]); // 2
      case 7:
        process1(items[i++]); // 2
      case 6:
        process1(items[i++]); // 2
      case 5:
        process1(items[i++]); // 2
      case 4:
        process1(items[i++]); // 2
      case 3:
        process1(items[i++]); // 2
      case 2:
        process1(items[i++]); // 2
      case 1:
        process1(items[i++]); // 2
    }
    startAt = 0;
  } while (--iterations);
  console.timeEnd("batch start");
}

async function main() {
  await a();
  setTimeout(() => {
    console.log("444");
  }, 500);
  b();
}

function a() {
  console.log("a");
  return 1;
}
function b() {
  console.log("b");
  return 2;
}

function addChild() {
  const rowCount = 2000;
  const divideInto = 100;
  const chunkSize = rowCount / divideInto;
  let iteration = 0;
}

function renderNode() {
  let base = chunkSize * iteration;
  for (let i = 0; i < chunkSize; i++) {}
}
</script>
<style scoped lang="scss"></style>
