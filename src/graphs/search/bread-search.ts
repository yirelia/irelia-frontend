import { Graph } from "../graph"

export class BreadFirstPaths {
    
    public marked: boolean[]
    public edgeTo: number[]

    public s: number

    constructor(graph: Graph, s: number) {
        this.marked = Array.from({length: graph.V}, () => false)
        this.edgeTo = Array.from({length: graph.V}, () => 0)
        this.s = s
        this.bfs(graph, s)
    }

    public bfs(graph: Graph,s: number) {
        const queue: number[] = []
        this.marked[s] = true
        queue.push(s)
        while(queue.length) {
            const v = queue.shift() as number
            const nodes = graph.adj[v].getNodes()
            for(const w of nodes) {
                if(!this.marked[w]) {
                    this.edgeTo[w] = v
                    this.marked[w] = true
                    queue.push(w)
                }

            }
        }
    }

    public hasPathTo(v: number) {
        return this.marked[v]
    }

    public pathTo(v: number) {
        if(!this.hasPathTo(v)) {
            return null
        }
        const path = []
        for(let x = v; x !== this.s; x = this.edgeTo[x]) {
            path.unshift(x)
        }
        path.unshift(this.s)
        return path

    }

}