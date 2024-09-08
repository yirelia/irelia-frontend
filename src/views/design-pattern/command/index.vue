<template>
    <el-button @click="save">保存</el-button>
    <el-button @click="add">新建</el-button>
    <el-button @click="undo">撤销</el-button>
    <el-button @click="redo">重做</el-button>
</template>
<script lang='ts' setup>
    import { AddCommand, History, SaveCommand } from './command';

    const history = new History()
    const save = () => {
        const savaCommand = new SaveCommand()
        history.push(savaCommand)
        savaCommand.execute()
    }
    const add = () => {
        const savaCommand = new AddCommand()
        history.push(savaCommand)
        savaCommand.execute()
    }

    const undo = () => {
        history.execute()
    }

    const redo = () => {
        history.execute(true)
    }



</script>
<style scoped lang="scss"></style>