import { Mode } from "fs";
import { ModelicaScope } from "./scope";
import { EquationsSyntax } from "./synatx";

export abstract class ModelicaSymbol {

    constructor() {
    }

    abstract accept(): Promise<any>;

    abstract print(): Promise<void>;

}


export abstract class ModelicaNamedElementSymbol extends ModelicaSymbol {

    #parent: any;

    constructor(parent?: ModelicaScope) {
        super();
        this.#parent = parent;
    }

    abstract get annotation(): Promise<any>;

    get parent() {
        return this.#parent;
    }
    abstract get syntax(): any ;


    get visibility(): boolean | undefined {
        return this.syntax?.visibility;
    }

}

export class ModelicaEquationSectionSymbol extends ModelicaNamedElementSymbol {
    print(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    #syntax?: any;

    constructor(parent: ModelicaScope, syntax?: EquationsSyntax) {
        super(parent);
        this.#syntax = syntax;
    }

    override async accept(): Promise<any> {
    }

    override get annotation(): Promise<any | undefined> {

        return async function () {
            return undefined;
        }();

    }

    override get syntax(): any{
        return this.#syntax;
    }

}

export class ModelicaClassSymbol extends ModelicaNamedElementSymbol {
    print(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    #syntax?: any;

    constructor(parent: ModelicaScope, syntax?: any) {
        super(parent);
        this.#syntax = syntax;
    }

    override async accept(): Promise<any> {
    }

    override get annotation(): Promise<any | undefined> {

        return async function () {
            return undefined;
        }();

    }

    override get syntax(): any{
        return this.#syntax;
    }

    get diagram() {
        return ``
    }

    get icon() {
        return ``
    }

    get parents() {
        return []
    }



}