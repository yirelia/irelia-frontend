import { Bag } from "../data-struct";

export class Graph {
    public V: number;
    public E: number;
    public adj: Bag<number>[]
    constructor(v: number) {
      this.V = v;
      this.E = 0
      this.adj =  Array.from({length: this.V}, () => new Bag())
    }
   
    private validateVertex(v: number): void {
      if (v < 0 || v >= this.V)
          throw new Error("vertex " + v + " is not between 0 and " + `${this.V - 1}`);
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
  
    public toString(): string {
      let s = this.V + " vertices, " + this.E + " edges " + '\n'
      for (let v = 0; v < this.V; v++) {
          const bag = this.adj[v]
          let head = bag.head
          s += `${v}: `
          while(head) {
            s += `${head.val} `
            head = head.next
          }
          s += '\n'
      }
      return s
    }

    public adjToArray(v: number) {
      const bag = this.adj[v]
      const vals = []
      let head = bag.head
      while(head) {
        vals.push(head.val)
        head = head.next
      }
      return vals
    }
}
  