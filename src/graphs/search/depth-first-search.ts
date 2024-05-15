import { Graph } from "../graph"

export class DepthFirstSearch {
    public marked: boolean[]
    public count: number

    constructor(graph: Graph, s: number) {
        this.marked = []
        this.count = 0
        this.marked = Array.from({length: graph.V}, () => false)
        this.dfs(graph, s)
    }

    public dfs(graph: Graph, v: number) {
        this.marked[v] = true
        this.count ++
        let head = graph.adj[v].head
        while(head) {
            const w = head.val
            if(!this.marked[w]) {
                this.dfs(graph, w)
            }
            head = head.next
        }

    }
}

