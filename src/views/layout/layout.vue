<template>
<el-container>
    <el-aside width="300">
        <aside-menu />
    </el-aside>
    <el-main>
        <router-view></router-view>
    </el-main>
</el-container>
</template>

<script setup lang="ts">
import AsideMenu from './menu.vue'
</script>

<style scoped>
.el-container {
    min-height: 100%;
}
</style>