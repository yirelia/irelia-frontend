import { Node } from "@antv/x6";
import { ports } from "./port";

export class AndGate extends Node {
    // private isFault: boolean = false

    // protected postprocess() {
    //     this.toggleFault(false)
    // }

    // public toggleFault(fault: boolean) {
    //     this.isFault = fault === undefined ? !this.isFault : fault
    //     if (fault) {
    //         this.attr('gateImage', { herf: '/gate/and-gate-active.png', })
    //     } else {
    //         this.attr('gateImage', { herf: '/gate/and-gate.png', })

    //     }
    // }

}

AndGate.config({
    shape: 'andGate',
    width: 100,
    height: 100,
    markup: [
        {
            tagName: 'image',
            selector: 'gateImage',
        },
    ],
    attrs: {
        gateImage: {
            herf: '/gate/and-gate.png',
            refWidth: 1,
            refHeight: 1,
        }
    },
    ports: { ...ports }
})



