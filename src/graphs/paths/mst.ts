import { Queue } from "../data-struct";
import { MinPQ } from "../data-struct/priority-queue";
import { Edge, EdgeWeightedGraph } from "../graph";

export class LazyPrimMST {
    private marked: boolean[];
    private pq: MinPQ
    private weight: number
    private mst: Queue<Edge>

    constructor(graph: EdgeWeightedGraph) {
        this.mst = new Queue<Edge>()
        this.pq = new MinPQ(graph.V)
        this.marked = Array.from({ length: graph.V }, () => false)
        this.weight = 0
        for (let i = 0; i < graph.V; i++) {
            if (!this.marked[i]) {
                this.prim(graph, i)
            }
        }
    }

    /**
     * @description: prim 算法
     * @param {EdgeWeightedGraph} graph
     * @param {number} s
     * @return {*}
     */
    private prim(graph: EdgeWeightedGraph, s: number) {
        this.scan(graph, s)
        while (!this.pq.isEmpty()) {
            const e = this.pq.delMin()
            console.log(`min edge: ${e.toString()}`)
            const v = e.either()
            const w = e.other(v)
            if (this.marked[v] && this.marked[w]) {
                continue
            }
            this.mst.enqueue(e)
            this.weight += e.getWeight()
            if (!this.marked[v]) {
                this.scan(graph, v)
            }
            if (!this.marked[w]) {
                this.scan(graph, w)
            }
        }
    }

    /**
     * @description: 
     * @param {EdgeWeightedGraph} graph
     * @param {number} s
     * @return {*}
     */
    private scan(graph: EdgeWeightedGraph, s: number) {
        this.marked[s] = true
        const edges = graph.adjToArray(s)
        for (const e of edges) {
            if (!this.marked[e.other(s)]) {
                this.pq.insert(e)
            }
        }
    }


    public edges() {
        return this.mst
    }

    public getWeight() {
        return this.weight
    }

}




export function testLazyPrimMST() {
    const graph = new EdgeWeightedGraph()
    const mst = new LazyPrimMST(graph)
    for (const edge of mst.edges().collection) {
        console.log(`${edge.toString()}`)
    }
    console.log(mst.getWeight())

    const mindumMst = new LazyPrimMST(new EdgeWeightedGraph('medium'))

    for (const edge of mindumMst.edges().collection) {
        console.log(`${edge.toString()}`)
    }
    console.log(mindumMst.getWeight())

}