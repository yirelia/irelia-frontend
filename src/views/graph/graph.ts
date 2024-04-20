export class Graph {
  private v: number;
  private bag: Map<number, number[]>;
  constructor(v: number) {
    this.v = v;
  }

  public addEdge(v, w): void {}

  public adj(v: number): number[] | undefined {
    return this.bag.get(v);
  }

  V(): number {
    return this.v; // 返回顶点数
  }

  E(): number {
    return 0; // 返回边数
  }

  string() {
    return "ssssss";
  }
}
