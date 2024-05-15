import { Graph } from "../graph";

export class CC {
    public marked: boolean[]
    public id: number[]
    public count: number
    constructor(graph: Graph) {
        this.marked = Array.from({length: graph.V}, () => false)
        this.id = Array.from({length: graph.V}, () => 0)
        this.count = 0
        for(let s = 0; s< graph.V; s++) {
            if(!this.marked[s]) {
                this.dfs(graph, s)
                this.count++
            }
            
        }
    }

    public dfs(graph: Graph, v: number) {
        this.marked[v] = true
        // 标记为那个联通分量
        this.id[v] = this.count
        const adjV = graph.adjToArray(v)
        for(const w of adjV) {
            if(!this.marked[w]) {
                this.dfs(graph, w)
            }
        }
    }

    public connected(v: number, w: number) {
        return this.id[v] === this.id[w]
    }
}