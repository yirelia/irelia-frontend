<script setup lang="ts">
import { routes } from "@/router";
import { useRouter } from "vue-router";
const router = useRouter();
const handleChange = (val) => {
  router.push(val);
};
</script>

<template>
  <el-select @change="handleChange">
    <el-option
      v-for="item in routes"
      :key="item"
      :label="item.meta?.name"
      :value="item.path"
    />
  </el-select>
  <router-view />
</template>

<style scoped></style>
