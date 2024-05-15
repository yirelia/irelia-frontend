export class Queue<T> {
    public collection:T[]

    constructor() {
        this.collection = []
    }

    public enqueue(item: T) {
        this.collection.unshift(item)
    }

    public dequeue(): T | undefined {
        return this.collection.pop()
    }

    public isEmpty() {
        return this.collection.length === 0
    }

    public size() {
        return this.collection.length
    }
}