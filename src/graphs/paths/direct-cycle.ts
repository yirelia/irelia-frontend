import { Stack } from "../data-struct"
import { Diagraph } from "../graph"

/**
 * 
 * 检查有项图中是否含有环
 */
export class DirectedCycle {
    public marked: boolean[]
    public edgeTo: number[]
    public cycle: Stack<number>
    public onStack: boolean[]

    constructor(G: Diagraph) {
        this.onStack = Array.from({length: G.V}, () => false)
        this.edgeTo = Array.from({length: G.V}, () => 0)
        this.marked = Array.from({length: G.V}, () => false)
        for(let v = 0; v < G.V; v++) {
            if(!this.marked[v]) {
                this.dfs(G, v)
            }
        }

    }


    private dfs(G: Diagraph, v: number) {
        this.onStack[v] = true
        this.marked[v] = true
        const adjArray = G.adjToArray(v)
        for(const w of adjArray) {
            if(this.hasCycle()) {
                return 
            } else if(!this.marked[w]) {
                this.edgeTo[w] = v;
                this.dfs(G, w)
            } else if(this.onStack[w]) {
                this.cycle = new Stack<number>()
                for(let x = v; x !== w; x = this.edgeTo[x]) {
                    this.cycle.push(x)
                }
                this.cycle.push(w)
                this.cycle.push(v)
            }   
        }
        this.onStack[v] = false
    }

    public hasCycle() {
        return this.cycle != null
    }



}