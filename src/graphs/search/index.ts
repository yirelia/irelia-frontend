import { readTinyCG } from "../graph";
import { DepthFirstSearch } from "./depth-first-search";

export function depSearch() {
    const graph = readTinyCG()
    const search = new  DepthFirstSearch(graph, 0)
    let result = ''
    for(let i = 0; i < graph.V; i++) {
        if(search.marked[i]) {
            result += `${i} `
        }
  
    }
    
    console.log(result, search.marked, graph)
    if(search.count !== graph.V) {
        console.log('not connected')
    } else {
        console.log(`graph connnected`)
    }
}