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
    path: "/command",
    meta: {
      name: "命令行模式",
    },
    component: () => import("@/views/design-pattern/command/index.vue"),
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
