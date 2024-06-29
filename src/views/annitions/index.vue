<template>
    <div class="icon-container">
        <!-- <div></div> -->
        <div class="icon-container" ref="gpContainer"></div>
        <div class="icon-title">
            <div>{{ renderCount }} / {{ num }}</div>
            <el-button @click="handleStart">start</el-button>
            <el-button @click="addNode">addNode</el-button>
            <el-button @click="addNodes">addNode</el-button>
            <el-button @click="clear">clear</el-button>
            <el-input style="width: 100px;" v-model.number="num"></el-input>
            <el-button @click="genData">genData</el-button>
        </div>

    </div>
</template>
<script lang="ts" setup>
    import { onMounted, ref, shallowRef } from 'vue'
    const gpContainer = ref<HTMLDivElement>()
    import { Graph } from '@antv/x6'
    import Nodes from './node.json'
    const renderCount = ref(0)
    const graph = shallowRef<Graph>()
    const graphData = shallowRef<any[]>([])
    const num = ref(10000)
    onMounted(() => {

        graph.value = new Graph({
            container: gpContainer.value!,
            background: {
                color: '#F2F7FA',
            },
        })
    })
    const clear = () => {
        graph.value?.clearCells()
        renderCount.value = 0
        graphData.value.length = 0
    }

    const handleStart = () => {
        graph.value?.clearCells()
        start(graph.value!, graphData.value)
    }

    function start(graph: Graph, nodes: any[]) {
        let chunkSize = 100
        let chunkCount = Math.ceil(num.value / chunkSize)
        let chunkIndex = 0
        const name = `render ${num.value}:`
        console.time(name)
        function render() {
            if (chunkIndex < chunkCount) {
                const chunks = nodes.slice(chunkIndex * chunkSize, (chunkIndex + 1) * chunkSize)
                console.log(chunkIndex * chunkSize, (chunkIndex + 1) * chunkSize)
                graph.addNodes(chunks)
                renderCount.value = graph.getNodes().length
                chunkIndex++
                requestAnimationFrame(render)
            } else {
                console.timeEnd(name)
            }


        }
        render()

    }

    const generateRandomPosition = () => {
        const x = Math.floor(Math.random() * 8000);
        const y = Math.floor(Math.random() * 8000);
        return { x, y, width: 100, height: 40 };
    };
    function genData() {
        graphData.value = []
        for (let i = 0; i < num.value; i++) {
            const position = generateRandomPosition();
            graphData.value.push(position)
        }
    }


    const addNode = () => {
        console.time('addNode')
        graphData.value.forEach((node, index) => {
            graph.value?.addNode(node)
            console.log(`rendered ${index + 1} nodes`)
        })
        console.timeEnd('addNode')
    }

    const addNodes = () => {
        console.time('addNodes')
        graph.value?.addNodes(graphData.value)
        console.timeEnd('addNodes')
    }



</script>
<style lang="scss" scoped>
.icon-container {
    height: 100%;
    position: relative;
}

.icon-title {
    position: absolute;
    right: 10px;
    top: 10px;
    display: flex;
    width: 1000px;
    gap: 10px;
}
</style>