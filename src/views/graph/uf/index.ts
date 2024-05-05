import tinyUF from './tinyUF.txt?raw'

export abstract class UF {
    public id: number[];
    public count: number;
    public data: string[]
    constructor() {
        this.data = tinyUF.split('\n')
        this.count = Number(this.data[0])
        this.id = Array.from({length: this.count}, (_, index) => index)
    }

    abstract find(p: number): number

    abstract union(p: number, q: number): void

    public connected(p: number, q: number): boolean {
        return this.find(p) === this.find(q)
    }

}

export class QuickFind extends UF {

    constructor() {
        super()
        const len = this.id.length
        for(let i = 1; i < len; i++) {
            const [p, q ] = this.data[i].split(' ').map(item => Number(item))
            if(!this.connected(p, q)) {
                this.union(p, q)
                console.log(`${p} ${q}`)
            }
        }

        console.log(`${this.count} components`)

    }
    public find(p: number): number {
        return this.id[p]
    }

    public union(p: number, q: number): void {
        const pId = this.id[p]
        const qId = this.id[q]
        if(pId === qId) {
            return
        }
        for(let i = 0; i < this.id.length; i ++) {
            if(this.id[i] === pId) {
                this.id[i] = qId
            }
        }
        this.count--
    }
}

export class QuickUnion extends UF {

    constructor() {
        super()
        const len = this.id.length
        for(let i = 1; i < len; i++) {
            const [p, q ] = this.data[i].split(' ').map(item => Number(item))
            if(!this.connected(p, q)) {
                this.union(p, q)
                console.log(`${p} ${q}`)
            }
        }

        console.log(`${this.count} components`)

    }

    public find(p: number) {
        while(p !== this.id[p]) {
             p = this.id[p]
        }
        return p
    }

    public union(p: number, q: number): void {
        const pRoot = this.find(p)
        const qRoot = this.find(q)
        if(pRoot === qRoot) {
            return
        }
        this.id[pRoot] = qRoot
        this.count --

    }
}


class WeightQuickUnion extends UF {
    public sz: number[]

    constructor() {
        super()
        this.sz = Array.from({length: this.count}, () => 1)
    }

    public find(p: number) {
        while(p !== this.id[p]) {
             p = this.id[p]
        }
        return p
    }


    public union(p: number, q: number): void {
        const pRoot = this.find(p)
        const qRoot = this.find(q)
        if(pRoot === qRoot) {
            return
        }
        // this.id[pRoot] = qRoot
        if(this.sz[pRoot] < this.sz[qRoot]) {
            this.id[pRoot] = qRoot
            this.sz[qRoot] += this.sz[pRoot]
        } else {
            this.id[qRoot] = pRoot
            this.sz[pRoot] += this.sz[qRoot]
        }
        this.count --

    }


}

export default function init() {
    // new QuickFind()
    new QuickUnion()
}