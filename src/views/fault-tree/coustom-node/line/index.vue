<template>
    <div class="echarts-wp">
        <div ref="chartRef" class="echarts-ins"></div>
    </div>
</template>

<script lang="ts" setup>
    import * as  echarts from 'echarts'
    import { onMounted, ref } from 'vue';
    const chartRef = ref()
    onMounted(() => {
        renderChart()
    })

    const renderChart = () => {
        const chart = echarts.init(chartRef.value)
        const option = {
            xAxis: {
                type: 'value',
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: [
                        [1, 100],
                        [2, 200],
                        [3, 200],
                        [4, 300],
                        [5, 400],
                        [6, 100],
                    ],
                    type: 'line'
                }
            ]
        }

        chart.setOption(option)
    }
</script>

<style scoped>
.echarts-wp {
    height: 100%;
    width: 100%;
    position: relative;
}

.echarts-ins {
    height: 100%;
    width: 100%;
}
</style>