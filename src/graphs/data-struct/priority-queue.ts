export class MaxPQ<T extends unknown = any> {
    private pq: T[]
    private N = 0
    constructor(maxn: number) {
        this.N = maxn
        this.pq = Array.from({ length: maxn + 1 })
    }

    public isEmpty() {
        return this.N === 0
    }

    public size() {
        return this.N
    }

    public insert(v: any) {
        this.pq[++this.N] = v
        this.swim(this.N)
    }

    private less(i: number, j: number) {
        return this.pq[i] < this.pq[j]
    }

    private exch(i: number, j: number) {
        const t = this.pq[i]
        this.pq[i] = this.pq[j]
        this.pq[j] = t
    }

    private swim(k: number) {
        while (k > 1 && this.less(Math.floor(k / 2), k)) {
            this.exch(k, Math.floor(k / 2))
            k = Math.floor(k / 2)
        }
    }

    public delMax() {
        const max = this.pq[1]
        this.exch(1, this.N--)
        this.pq[this.N + 1] = null as any
        this.sink(1)
        return max
    }

    private sink(k: number) {
        while (2 * k <= this.N) {
            let j = 2 * k
            if (j < this.N && this.less(j, j + 1)) j++
            if (!this.less(k, j)) break
            this.exch(k, j)
            k = j
        }
    }
}




export class MinPQ {
    private pq: any[]
    private N = 0
    constructor(maxn: number) {
        this.pq = Array.from({ length: maxn + 1 })
    }

    public isEmpty() {
        return this.N === 0
    }

    public size() {
        return this.N
    }

    public insert(v: any) {
        this.pq[++this.N] = v
        this.swim(this.N)
    }

    private greater(i: number, j: number) {
        return this.pq[i].getWeight() > this.pq[j].getWeight()
    }

    private exch(i: number, j: number) {
        const t = this.pq[i]
        this.pq[i] = this.pq[j]
        this.pq[j] = t
    }

    private swim(k: number) {
        console.log(`swim: ${k}`)
        while (k > 1 && this.greater(Math.floor(k / 2), k)) {
            this.exch(Math.floor(k / 2), k)
            k = Math.floor(k / 2)
        }
    }

    public delMin() {
        const max = this.pq[1]
        this.exch(1, this.N--)
        this.pq[this.N + 1] = null
        this.sink(1)
        return max
    }

    private sink(k: number) {
        while (2 * k <= this.N) {
            let j = 2 * k
            if (j < this.N && this.greater(j, j + 1)) j++
            if (!this.greater(k, j)) break
            this.exch(k, j)
            k = j
        }
    }

    public print() {
        console.log(this.pq)
    }

}

export function testMin() {
    const pq = new MinPQ(10)
    pq.insert(10)
    pq.insert(7)
    pq.insert(8)
    pq.insert(1)
    pq.insert(3)
    pq.insert(4)
    pq.insert(5)
    pq.insert(2)
    pq.insert(0)
    pq.insert(11)
    pq.print()
    console.log(pq.delMin())
    console.log(pq.delMin())
    console.log(pq.delMin())
    console.log(pq.delMin())
    console.log(pq.delMin())
    console.log(pq.delMin())
}

export class IndexMinPQ {
    private maxN: number; // PQ 最大容量
    private n: number; // PQ 当前容量
    private pq: number[]; // 二叉堆，由1开始

    private qp: number[]; // 逆序：qp[pq[i]] = pq[qp[i]] = i
    private keys: any[]; // keys[i] = priority of i

    constructor(maxN: number) {
        this.maxN = maxN;
        this.n = 0;
        this.pq = Array.from({ length: maxN + 1 }, () => 0);
        this.qp = Array.from({ length: maxN + 1 }, () => 0);
        this.keys = Array.from({ length: maxN + 1 });
        for (let i = 0; i <= this.maxN; i++) {
            this.qp[i] = -1
        }
    }

    public isEmpty(): boolean {
        return this.n === 0;
    }

    public contains(i: number): boolean {
        return this.qp[i] !== -1;
    }
}