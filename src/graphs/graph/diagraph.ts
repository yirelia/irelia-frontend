import { Bag } from "../data-struct";
/**
 * 
 * 有方向的边
 */
export class Diagraph {
    public V: number;
    public E: number;
    public adj: Bag<number>[]
    constructor(v: number) {
      this.V = v;
      this.E = 0
      this.adj =  Array.from({length: this.V}, () => new Bag())
    }
  
    public addEdge(v: number, w: number): void {
      this.E++
      this.adj[v].addItem(w)
    }
  
    public degree(v: number) {
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

    public reverse() {
        const R  = new Diagraph(this.V)
        for(let v = 0; v < this.V; v++) {
            const vals = this.adjToArray(v)
            for(const w of vals) {
                R.addEdge(w, v)
            }
        }
        return R
    }
}
  