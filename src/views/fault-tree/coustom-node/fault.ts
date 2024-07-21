import { Node } from "@antv/x6";
import { ports } from "./port";

export class Falut extends Node {
    private isActive = false

    protected postprocess() {
        this.toggleActive(this.isActive)
    }

    public isFault() {
        return this.isActive
    }

    public toggleActive(active: boolean) {
        this.isActive = active === undefined ? !this.isActive : active
        if (active) {
            this.attr('label', { stroke: '#d81e06' })
        } else {
            this.attr('label', { stroke: '#2c2c2c' })
        }
    }

}

Falut.config({
    shape: 'Fault',
    width: 100,
    height: 100,
    markup: [
        {
            tagName: 'circle',
            selector: 'body',

        },
        {
            tagName: 'text',
            selector: 'label',

        }
    ],
    attrs: {
        body: {
            refR: '50%',
            stroke: '#2c2c2c',
            fill: '#fff',
            refCx: '50%', // 圆中心 x 坐标位于节点中心
            refCy: '50%', // 圆中心 y 坐标位于节点中心
            event: 'dispach:fault',
            cursor: 'pointer',
        },
        label: {
            text: '故障',
            stroke: '#2c2c2c',
            refX: 0.5,
            refY: 0.5,
            "textAnchor": "middle",
            "textVerticalAnchor": "middle",
            "fontFamily": "Arial, helvetica, sans-serif",
        }
    },
    ports: { ...ports }
})

