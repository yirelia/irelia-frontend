import { Bag } from "../data-struct";
import { initDiagraphTindyDG, initEWD, readTinyCG, readTinyG } from "../graph";
import { BreadthFirstPaths } from "./breadth-path";
import { CC } from "./cc";
import { DepthFirstPaths } from "./dep-path";
import { DirectDFPaths } from "./direc-df-path";
import { DirectedCycle } from "./direct-cycle";
export * from './mst'


export function pathTo() {
  const graph = readTinyCG();
  const depthPath = new DepthFirstPaths(graph, 0);
  for (let i = 0; i < graph.V; i++) {
    const paths = depthPath.pathTo(i);
    console.log(`0 to ${i} : ${paths?.collention.reverse().join("-")}`);
  }
}

export function breadPathTo() {
  const graph = readTinyCG();
  const depthPath = new BreadthFirstPaths(graph, 0);
  for (let i = 0; i < graph.V; i++) {
    const paths = depthPath.pathTo(i);
    console.log(`0 to ${i} : ${paths?.collention.reverse().join("-")}`);
  }
}

export function prinCcc() {
  const graph = readTinyG();
  const c = new CC(graph);
  console.log("===== cc ======");
  console.log(`${c.count} components`);
  const components = Array.from({ length: c.count }, () => new Bag<number>());
  for (let i = 0; i < graph.V; i++) {
    components[c.id[i]].addItem(i);
  }
  for (let i = 0; i < c.count; i++) {
    let item = components[i];
    let s = "";
    let head = item.head;
    while (head) {
      s += head.val + " ";
      head = head.next;
    }
    console.log(s);
  }
}

export function testDirectDFPaths() {
  const graph = initDiagraphTindyDG();
  console.log("===== diagraph paths ======");
  const directDfPath = new DirectDFPaths(graph, 1);
  let s = ''
  for (let v = 0; v < graph.V; v++) {
    if (directDfPath.marked[v]) {
      s += `${v} `
    }
  }
  console.log(`[1]:`, s)

  s = ''
  const directDfPath1 = new DirectDFPaths(graph, 2);
  s = ''
  for (let v = 0; v < graph.V; v++) {
    if (directDfPath1.marked[v]) {
      s += `${v} `
    }
  }
  console.log(`[2]:`, s)
  s = ''
  const directDfPath2 = new DirectDFPaths(graph, [1, 2, 6]);
  s = ''
  for (let v = 0; v < graph.V; v++) {
    if (directDfPath2.marked[v]) {
      s += `${v} `
    }
  }


  console.log(`[1,2, 6]:`, s)
}

export function hasCycle() {
  const graph = initDiagraphTindyDG();
  const hCycle = new DirectedCycle(graph)
  console.log(`是否含有环： `, hCycle.hasCycle())
  if (hCycle.hasCycle()) {
    console.log(hCycle.cycle.collention.join('->'))
  }

}

export function testEdgeWeightedGraph() {
  initEWD()
}