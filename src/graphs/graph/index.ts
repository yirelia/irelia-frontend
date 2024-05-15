export * from './graph'
export * from './edge-graph'
import { Graph } from './graph'
import tinyCG from '../files/tinyCG.txt?raw'
import tinyG from '../files/tinyG.txt?raw'

export function readTinyCG() {
    const tinyGList = tinyCG.split('\n')
    const v  = parseInt(tinyGList[0], 10)  
    const graph = new Graph(v)
    for(let i = 2; i < tinyGList.length; i ++) {
      const [v, w] = tinyGList[i].split(' ').map(item => parseInt(item, 10))
      graph.addEdge(v, w)
    }
    return graph
}

export function readTinyG() {
    const tinyGList = tinyG.split('\n')
    const v  = parseInt(tinyGList[0], 10)  
    const graph = new Graph(v)
    for(let i = 2; i < tinyGList.length; i ++) {
      const [v, w] = tinyGList[i].split(' ').map(item => parseInt(item, 10))
      graph.addEdge(v, w)
    }
    return graph
}


export function printGraph() {
    const graph = readTinyCG()
   console.log(graph.toString())
}