import { Queue, Stack } from "../data-struct"
import { Diagraph } from "../graph"

export class  DepthFirstOrder {

    public marked: boolean[]
    // 所有顶点前序排列
    public pre: Queue<number>

    public post: Queue<number>

    public reversePost: Stack<number>

    constructor (G: Diagraph) {
        this.pre = new Queue<number>()
        this.post = new Queue<number>()
        this.reversePost = new Stack<number>()
        this.marked = Array.from({length: G.V}, () => false)
    }

    public dfs(G:Diagraph, v: number) {
        this.pre.enqueue(v)
        this.marked[v] = true
        const ad = G.adjToArray(v)
        for(const w of ad) {
            if(!this.marked[w]) {
                this.dfs(G, w)
            }
        }
        this.post.enqueue(v)
        this.reversePost.push(v)
    }

    
}