import { ModelicaContext } from "./context";

export interface ModelicaScope {
 
    get context(): ModelicaContext;

    resolve(reference:  string[] | string | null | undefined, global?: boolean): Promise<ModelicaNamedElementSymbol | null>;

    resolveFunction(reference: ModelicaComponentReferenceExpressionSyntax | ModelicaIdentifierSyntax | ModelicaNameSyntax | ModelicaTypeSpecifierSyntax | string[] | string | null | undefined, global?: boolean): Promise<ModelicaClassSymbol | null>;

}
