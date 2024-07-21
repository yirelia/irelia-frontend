<template>
    <div class="canvas-render" ref="x6Ref"></div>
</template>
<script setup lang="ts">
    import { Graph } from "@antv/x6";
    import { onMounted, ref } from "vue";

    const x6Ref = ref();

    onMounted(() => {
        const graph = new Graph({
            container: x6Ref.value,
            panning: true,
            mousewheel: true,
        });
        graph.on('node:click', ({ node }) => {
            console.log(node.id);
            if (node.parent) {
                node.parent.addChild(node)
            }
            console.log(node.parent, node.getChildren())

        });
        const p = graph.addNode({
            id: `parent`,
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            label: "parent",
        });
        graph.addNode({
            id: `child-1`,
            x: 0,
            y: 0,
            width: 40,
            height: 40,
            parent: `parent`,
            label: "child",
        });



        graph.centerContent();
    });
</script>
<style scoped>
.canvas-render {
    height: 100%;
    width: 100%;
}
</style>