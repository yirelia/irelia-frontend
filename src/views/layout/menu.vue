<!--
 * @Author: simtek/yangrui 17368465776@163.com
 * @Date: 2023-09-11 09:38:23
 * @LastEditors: simtek/yangrui 17368465776@163.com
 * @LastEditTime: 2024-02-07 10:18:04
 * @FilePath: \irelia-frontend\src\views\layout\menu.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-menu
    default-active="/svg-animation"
    class="el-menu-vertical-demo"
    @select="select"
  >
    <el-menu-item :index="item.path" v-for="item in menus">
      <span>{{ item.meta?.name }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { routes } from "@/router";
import { computed } from "vue";

const router = useRouter();
const menus = computed(() => {
  return routes;
});

const select = (index: string) => {
  router.push(index);
};
</script>

<style scoped></style>
