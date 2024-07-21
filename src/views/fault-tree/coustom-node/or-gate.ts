import { Node } from "@antv/x6";
import { ports } from "./port";

export class OrGate extends Node {

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
            this.attr('gateImage', { href: '/gate/or-gate-active.png' })
        } else {
            this.attr('gateImage', { href: '/gate/or-gate.png' })
        }
    }

}

OrGate.config({
    shape: 'orGate',
    width: 100,
    height: 100,
    markup: [
        {
            tagName: 'image',
            selector: 'gateImage',
        }
    ],
    attrs: {
        gateImage: {
            href: '/gate/or-gate.png',
            refWidth: 1,
            refHight: 1,
        },
    },
    ports: { ...ports }
})

