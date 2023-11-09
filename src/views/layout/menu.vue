<!--
 * @Author: simtek/yangrui 17368465776@163.com
 * @Date: 2023-09-11 09:38:23
 * @LastEditors: simtek/yangrui 17368465776@163.com
 * @LastEditTime: 2023-11-07 14:02:37
 * @FilePath: \irelia-frontend\src\views\layout\menu.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-menu
    default-active="/svg-animation"
    class="el-menu-vertical-demo"
    @select="select"
  >
    <el-menu-item :index="item.url" v-for="item in menus">
      <span>{{ item.label }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
const menus = [
  {
    url: "/svg-animation",
    label: "svg路径动画",
  },
  {
    url: "/dom",
    label: "DOM 解析",
  },
];

const select = (index: string) => {
  router.push(index);
};
</script>

<style scoped></style>
