export class Bag<T> {
  public head: Node | null;
  public size = 0;
  
  constructor() {
    this.head = null
  }

  public addItem(item: T) {
    const oldHead = this.head
    this.head = new Node(item);
    this.head.next = oldHead
    this.size ++
  }

  public addItems(items: T[]) {
    for(const item of items) {
      this.addItem(item)
    }
  }

  public isEmpty() {
    return this.head == null
  }

  public toString() {
    let node = this.head
    let s = ''
    while(node) {
      s += `${node.val} \n`
      node = node.next
    }
    console.log(s)
  }

  public getNode() {
    return this.head
  }

  public getNodes() {
    const nodes: number[] = []
    let head = this.head
    while(head) {
      nodes.push(head!.val)
      head = head!.next
    }
    return nodes
  }
}

class Node<T extends any = any> {
  public next: Node | null = null;
  public pre: Node | null = null
  public val: T | undefined = undefined
  constructor(val?: T) {
    this.val = val;
    
  }
}
