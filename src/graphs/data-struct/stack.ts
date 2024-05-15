export class Stack<T> {
    public collention: T[]
    constructor() {
        this.collention = []
    }

    public push(item: T) {
        this.collention.push(item)
    }
    
    public pop(): T | undefined  {
        return this.collention.pop()
    }

    public isEmpty() {
        return this.collention.length === 0
    }

    public size() {
        return this.collention.length
    }
}