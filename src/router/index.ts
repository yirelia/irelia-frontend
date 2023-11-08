/*
 * @Author: simtek/yangrui 17368465776@163.com
 * @Date: 2023-09-11 09:27:45
 * @LastEditors: simtek/yangrui 17368465776@163.com
 * @LastEditTime: 2023-09-20 16:04:23
 * @FilePath: \irelia-frontend\src\router\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes:[
        {
            path: '/',
            redirect: ''
        },
        {
            path: '/svg-animation',
            component: () => import('@/views/svg/test-svg.vue')
        },
        {
            path: '/three',
            component: () => import('@/views/three/index.vue')
        },
        {
            path: '/file',
            component: () => import('@/views/upload-big-file/index.vue')
        }
    ]
})


export default router