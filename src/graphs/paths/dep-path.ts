import { Stack } from "../data-struct"
import { Graph } from "../graph"

export class DepthFirstPaths {
    public marked: boolean[]
    public edgeTo: number[]
    public source: number
    public graph: Graph

    constructor(graph: Graph, source: number) {
        this.source = source
        this.graph = graph
        this.marked = Array.from({length: graph.V}, () => false)
        this.edgeTo = Array.from({length: graph.V}, () => 0)
        this.dfs(graph, source)
    }

    private dfs(graph: Graph, v: number) {
        this.marked[v] = true
        let head = graph.adj[v].head
        while(head) {
            const w = head.val
            if(!this.marked[w]) {
                this.edgeTo[w] = v
                this.dfs(graph, w)
            }
            head = head.next
        }
    }

    public hasPathTo(v: number) {
        return this.marked[v]
    }

    public pathTo(v: number){
        const path = new Stack<number>()
        if(!this.hasPathTo(v)) {
            return path
        }
        for(let x = v; x !== this.source; x = this.edgeTo[x]) {
            path.push(x)
        }
        path.push(this.source)
        return path

    }
}