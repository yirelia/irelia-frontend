import { Bag } from "./data/bag";
import { DepthFirstSearch } from "./depth-first-search";
import tinyG from './files/tinyG.txt?raw'

export class Graph {
  public V: number;
  public E: number;
  public adj: Bag<number>[]
  constructor(v: number) {
    this.V = v;
    this.E = 0
    this.adj = []
    for(let i = 0; i < this.V; i++) {
      this.adj.push(new Bag())
    }
    console.log(this.adj)
  }
 
  private validateVertex(v: number): void {
    if (v < 0 || v >= this.V)
        throw new Error("vertex " + v + " is not between 0 and " + (V-1));
}

  public addEdge(v: number, w: number): void {
    this.validateVertex(v)
    this.validateVertex(w)
    this.E++
    this.adj[v].addItem(w)
    this.adj[w].addItem(v)
  }

  public degree(v: number) {
    this.validateVertex(v)
    return this.adj[v].size
  }

  toString(): string {
    let s = this.V + " vertices, " + this.E + " edges " + '\n'
    for (let v = 0; v < this.V; v++) {
        const bag = this.adj[v]
        const size = bag.size
        let head = bag.getNode()
        s += `${v}: `
        while(size && head) {
          s += `${head.val} `
          head = head.next
        }
        s += '\n'
    }
    return s
  }
}



export function readTinyG() {
  const tinyGList = tinyG.split('\n')
  const v  = parseInt(tinyGList[0], 10)
  // const e = parseInt(tinyGList[1], 10)

  const graph = new Graph(v)
  for(let i = 2; i < tinyGList.length; i ++) {
    const [v, w] = tinyGList[i].split(' ').map(item => parseInt(item, 10))
    graph.addEdge(v, w)
  }
  console.log(graph.toString()) 
  return graph
}

export function dfsSearch() {
  const graph = readTinyG()
  const search = new DepthFirstSearch(graph, 0)
  for (let v = 0; v < graph.V; v++) {
    if (search.marked[v]) console.log(`${v} `)
  }

  if (search.count != graph.V)  {
    console.log(`NOT connected`)
  } else {
    console.log(`connected`)
  }
}