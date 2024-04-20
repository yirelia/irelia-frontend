export class Bag<T> {
  //   private map: Map<number, Node>;
  private head: Node;
  private size = 0;
  
  constructor() {
    this.map = new Map();
    this.head = new Node();
  }

  public addItem(item: T) {
    const node = new Node(item);
    this.map.set();
  }
}

class Node<T extends any = any> {
  public next: Node | null;
  public val: T | undefined;
  constructor(val?: T) {
    this.val = val;
  }
}
