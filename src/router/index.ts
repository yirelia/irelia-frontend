/*
 * @Author: simtek/yangrui 17368465776@163.com
 * @Date: 2023-09-11 09:27:45
 * @LastEditors: simtek/yangrui 17368465776@163.com
 * @LastEditTime: 2024-10-28 11:00:26
 * @FilePath: \irelia-frontend\src\router\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRouter, createWebHistory } from "vue-router";

export const routes = [
  {
    path: "/",
    redirect: "/2d",
  },
  {
    path: "/3d",
    meta: {
      name: "svg路径动画",
    },
    component: () => import("@/views/3D/index.vue"),
  },
  {
    path: "/plane",
    meta: {
      name: "svg路径动画",
    },
    component: () => import("@/views/3D/plane.vue"),
  },
  {
    path: "/dump",
    meta: {
      name: "svg路径动画",
    },
    component: () => import("@/views/3D/dump.vue"),
  },
  {
    path: "/grain",
    meta: {
      name: "粒子系统测试",
    },
    component: () => import("@/views/3D/grain.vue"),
  },
  {
    path: "/2d",
    meta: {
      name: "svg路径动画",
    },
    component: () => import("@/views/2D/index.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
