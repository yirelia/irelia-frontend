<template>
    <div class="x6-ref">
        <div ref="x6Instance" class="x6-graph"></div>
    </div>
</template>
<script lang='ts' setup>
    import { Graph } from '@antv/x6/es';
    import { onMounted, ref } from 'vue';
    const x6Instance = ref()
    onMounted(() => {
        const graph = new Graph({
            container: x6Instance.value,
            grid: true,
            background: {
                color: '#f0f0f0'
            },
            translating: {
                restrict: true,

            },
            scaling: {
                min: 0.5,
                max: 2
            },
            panning: true,

        });
        graph.addNode({
            x: 40,
            y: 40,
            width: 100,
            height: 40,
            label: 'Hello',
            tools: {
                name: 'boundary',
                args: {
                    attrs: {
                        fill: '#f0f0f0',
                        stroke: '#31d0c6',
                        strokeWidth: 2,
                        strokeDasharray: '5 5',
                    },
                },
            },
        });
        graph.addEdge({
            source: { x: -100, y: 0 },
            target: { x: 100, y: 0 }

        })

        graph.addEdge({
            source: { x: 0, y: -100 },
            target: { x: 0, y: 100 },
        })

        graph.centerPoint(0, 0)
    })
</script>
<style lang="scss" scoped>
.x6-ref {
    height: 100%;
    width: 100%;

    .x6-graph {
        height: 100%;
        width: 100%;
    }
}
</style>