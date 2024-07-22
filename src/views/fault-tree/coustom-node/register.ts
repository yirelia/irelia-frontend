import { register } from '@antv/x6-vue-shape'
import Line from './line'
import Gauge from './gauge'

const comps = [Line, Gauge]

export function registerCharts() {
    comps.forEach(chart => {
        register({
            shape: chart.name,
            component: chart.component,
            width: 200,
            height: 200
        })
    })

}