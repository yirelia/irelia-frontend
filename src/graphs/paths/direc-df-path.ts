import { Diagraph } from "../graph";
export class DirectDFPaths {
  public marked: boolean[];
  constructor(graph: Diagraph, source: number | number[]) {
    this.marked = Array.from({ length: graph.V }, () => false);
    if (Array.isArray(source)) {
      source.forEach((v) => {
        if (!this.marked[v]) {
          this.dfs(graph, v);
        }
      });
    } else {
      this.dfs(graph, source);
    }
  }

  private dfs(graph: Diagraph, v: number) {
    this.marked[v] = true;
    const vs = graph.adjToArray(v);
    vs.forEach((item) => {
      if (!this.marked[item]) {
        this.dfs(graph, item);
      }
    });
  }
}
