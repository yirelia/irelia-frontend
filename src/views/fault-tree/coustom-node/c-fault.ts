import { Node } from "@antv/x6";
export const ports = {
    groups: {
        top: {
            position: 'top',
            attrs: {
                circle: {
                    r: 10,
                    magnet: true,
                    stroke: 'red',
                    strokeWidth: 1,
                    fill: '#fff',
                    style: {
                        visibility: 'hidden',
                    },
                },
            },
        },
        bottom: {
            position: 'bottom',
            attrs: {
                circle: {
                    r: 10,
                    magnet: true,
                    stroke: 'green',
                    strokeWidth: 1,
                    fill: '#fff',
                    style: {
                        visibility: 'hidden',
                    },
                },
            },
        },
    },
    items: [
        {
            group: 'bottom',
            id: 'bottom'
        },
    ],
}
export class CFalut extends Node {
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

CFalut.config({
    shape: 'CFalut',
    width: 100,
    height: 100,
    markup: [
        {
            tagName: 'rect',
            selector: 'body',

        },
        {
            tagName: 'text',
            selector: 'label',

        }
    ],
    attrs: {
        body: {
            refWidth: 1,
            refHeight: 1,
            stroke: '#2c2c2c',
            fill: '#fff',
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




