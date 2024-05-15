import { Bag } from "../data-struct";
import { readTinyCG, readTinyG } from "../graph";
import { BreadthFirstPaths } from "./breadth-path";
import { CC } from "./cc";
import { DepthFirstPaths } from "./dep-path";
export function pathTo() {
    const graph = readTinyCG()
    const depthPath = new DepthFirstPaths(graph, 0)
    for(let i = 0; i < graph.V; i++) {
        const paths = depthPath.pathTo(i)
        console.log(`0 to ${i} : ${paths?.collention.reverse().join('-')}`)
    }
}

export function breadPathTo() {
    const graph = readTinyCG()
    const depthPath = new BreadthFirstPaths(graph, 0)
    for(let i = 0; i < graph.V; i++) {
        const paths = depthPath.pathTo(i)
        console.log(`0 to ${i} : ${paths?.collention.reverse().join('-')}`)
    }
}

export function prinCcc() {
    const graph = readTinyG()
    const c = new CC(graph)
    console.log('===== cc ======')
    console.log(`${c.count} components`)
    const components = Array.from({length: c.count}, () => new Bag<number>())
    for(let i = 0; i < graph.V; i++) {
        components[c.id[i]].addItem(i)
    }
    for(let i =0 ; i< c.count; i++) {
        let item = components[i]
        let s = ''
        let head = item.head
        while(head) {
            s += head.val + ' '
            head = head.next
        }
        console.log(s)
    }

}