import { Queue, Stack } from "../data-struct"
import { Graph } from "../graph"

export class BreadthFirstPaths {
    public marked: boolean[]
    public edgeTo: number[]
    public s: number
    public graph: Graph

    constructor(graph: Graph, s:number) {
        this.graph = graph
        this.s = s
        this.edgeTo = Array.from({length}, () => 0)
        this.marked = Array.from({length}, () => false)
        this.bfs(graph, s)
        
    }

    public bfs(graph: Graph, s: number) {
        const queue = new Queue<number>()
        queue.enqueue(s)
        while(queue.collection.length) {
            const v = queue.dequeue()!
            const adjs = graph.adjToArray(v)
            for(let w of adjs) {
                if(!this.marked[w]) {
                    this.edgeTo[w] = v
                    this.marked[w] = true
                    queue.enqueue(w)
                }
            }

        }
    }

    public hasPathTo(v: number) {
        return this.marked[v]
    }

    public pathTo(v: number) {
        const paths = new Stack<number>()
        if(!this.hasPathTo(v)) {
            return paths
        }

        for(let x = v; x !== this.s; x = this.edgeTo[x]) {
            paths.push(x)
        }
        paths.push(this.s)
        return paths
    }
}