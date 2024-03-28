/*
 * @Author: simtek/yangrui 17368465776@163.com
 * @Date: 2023-09-11 09:27:45
 * @LastEditors: simtek/yangrui 17368465776@163.com
 * @LastEditTime: 2024-02-07 10:58:21
 * @FilePath: \irelia-frontend\src\router\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { createRouter, createWebHistory } from "vue-router";

export const routes = [
  {
    path: "/svg-animation",
    meta: {
      name: "svg路径动画",
    },
    component: () => import("@/views/svg/test-svg.vue"),
  },
  {
    path: "/three",
    component: () => import("@/views/three/index.vue"),
    meta: {
      name: "3D库",
    },
  },
  {
    path: "/file",
    component: () => import("@/views/upload-big-file/index.vue"),
    meta: {
      name: "大文件分批上传",
    },
  },
  {
    path: "/dom",
    component: () => import("@/views/domparse/index.vue"),
    meta: {
      name: "DOM 解析",
    },
  },
  {
    path: "/render",
    component: () => import("@/views/geo/index.vue"),
    meta: {
      name: "绘图渲染",
    },
  },
  {
    path: "/tupu",
    component: () => import("@/views/tupu/index.vue"),
    meta: {
      name: "关键能力图谱",
    },
  },
  {
    path: "/loop",
    component: () => import("@/views/loop/index.vue"),
    meta: {
      name: "for循环性能优化",
    },
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "",
    },
    ...routes,
  ],
});

export default router;
