<!--
 * @Author: simtek/yangrui 17368465776@163.com
 * @Date: 2023-09-11 09:32:17
 * @LastEditors: simtek/yangrui 17368465776@163.com
 * @LastEditTime: 2023-09-11 11:19:56
 * @FilePath: \irelia-frontend\src\views\svg\test-svg.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%A100
-->
<template>
   <svg version="1.1"
     baseProfile="full"
     width="100%" height="100%"
     xmlns="http://www.w3.org/2000/svg">
     <path
        ref="pathEl2"
        fill="none"
        :stroke-dasharray="dashArray"
        stroke="red"
        stroke-width="6"
            d="M 10,30
            A 20,20 0,0,1 50,30
            A 20,20 0,0,1 90,30
            Q 90,60 50,90
            Q 10,60 10,30 z" >
            <!-- <animate
                attributeName="dash"
                values="0;5;0"
                dur="10s"
                repeatCount="indefinite" /> -->
            </path>

     <path
        ref="pathEl"
        fill="none"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="strokeDashoffset"
        stroke-width="6"
        stroke="green"
            d="M 10,30
            A 20,20 0,0,1 50,30
            A 20,20 0,0,1 90,30
            Q 90,60 50,90
            Q 10,60 10,30 z" >
            <animate
                attributeName="stroke-dashoffset"
                from="275"
                to="0"
                dur="4s"
                repeatCount="indefinite" />
            </path>

    

    <path d="M0, 200, L200, 200, L400, 200" stroke="green" stroke-width="6"></path>
    <path d="M0, 250, L200, 250, L400, 250" stroke="green" stroke-dasharray="2" stroke-width="6"></path>
    <path d="M0, 280, L200, 280, L400, 280" stroke="green" stroke-dasharray="10" stroke-width="6">
        <animate attributeName="stroke-dashoffset" from="0" to="-40" dur="2" fill="freeze" repeatCount="indefinite" easing="linear"></animate></path>
</svg>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const pathEl = ref<SVGGeometryElement>()

const dashArray = ref(275)
const strokeDashoffset = ref(-275)

onMounted(() => {
    const totalLength = pathEl.value?.getTotalLength()
    console.log(totalLength)

})

</script>

<style scoped>

</style>