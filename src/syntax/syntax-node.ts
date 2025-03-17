export abstract class ModelicaSyntaxNode {

    #parsed: boolean = false;
    #source?: SyntaxNode | null;

    constructor(source?: SyntaxNode | null) {
        this.#source = source;
    }

    abstract accept(visitor: ModelicaSyntaxVisitor, ...args: any[]): any;

    get children(): IterableIterator<ModelicaSyntaxNode> {
        this.parse();
        return function* () { }();
    }

    static new(source?: SyntaxNode | null): ModelicaSyntaxNode[] | ModelicaSyntaxNode | undefined {

        switch (source?.type) {

            case "algorithm_section":
                return ModelicaAlgorithmSectionSyntax.new(source);

            case "annotation_clause":
                return ModelicaAnnotationClauseSyntax.new(source);

            case "array_comprehension":
                return ModelicaArrayComprehensionExpressionSyntax.new(source);

            case "array_concatenation":
                return ModelicaArrayConcatenationExpressionSyntax.new(source);

            case "array_constructor":
                return ModelicaArrayConstructorExpressionSyntax.new(source);

            case "assignment_statement":
                return ModelicaAssignmentStatementSyntax.new(source);

            case "binary_expression":
                return ModelicaBinaryExpressionSyntax.new(source);

            case "break_statement":
                return ModelicaBreakStatementSyntax.new(source);

            case "class_definition":
                return ModelicaClassDefinitionSyntax.new(source);

            case "class_modification":
                return ModelicaClassModificationSyntax.new(source);

            case "class_redeclaration":
                return ModelicaClassRedeclarationSyntax.new(source);

            case "component_redeclaration":
                return ModelicaComponentRedeclarationSyntax.new(source);

            case "component_reference":
                return ModelicaComponentReferenceExpressionSyntax.new(source);

            case "connect_clause":
                return ModelicaConnectClauseSyntax.new(source);

            case "constraining_clause":
                return ModelicaConstrainingClauseSyntax.new(source);

            case "derivative_class_specifier":
                return ModelicaDerivativeClassSpecifierSyntax.new(source);

            case "description_string":
                return ModelicaDescriptionStringSyntax.new(source);

            case "element_modification":
                return ModelicaElementModificationSyntax.new(source);

            case "else_if_equation_clause":
                return ModelicaElseIfEquationClauseSyntax.new(source);

            case "else_if_expression_clause":
                return ModelicaElseIfExpressionClauseSyntax.new(source);

            case "else_if_statement_clause":
                return ModelicaElseIfStatementClauseSyntax.new(source);

            case "else_when_equation_clause":
                return ModelicaElseWhenEquationClauseSyntax.new(source);

            case "else_when_statement_clause":
                return ModelicaElseWhenStatementClauseSyntax.new(source);

            case "end_expression":
                return ModelicaEndExpressionSyntax.new(source);

            case "enumeration_class_specifier":
                return ModelicaEnumerationClassSpecifierSyntax.new(source);

            case "enumeration_literal":
                return ModelicaEnumerationLiteralSyntax.new(source);

            case "equation_section":
                return ModelicaEquationSectionSyntax.new(source);

            case "extends_class_specifier":
                return ModelicaExtendsClassSpecifierSyntax.new(source);

            case "extends_clause":
                return ModelicaExtendsClauseSyntax.new(source);

            case "external_clause":
                return ModelicaExternalClauseSyntax.new(source);

            case "external_function":
                return ModelicaExternalFunctionSyntax.new(source);

            case "for_equation":
                return ModelicaForEquationSyntax.new(source);

            case "for_index":
                return ModelicaForIndexSyntax.new(source);

            case "for_statement":
                return ModelicaForStatementSyntax.new(source);

            case "function_application":
                return ModelicaFunctionApplicationExpressionSyntax.new(source);

            case "function_application_equation":
                return ModelicaFunctionApplicationEquationSyntax.new(source);

            case "function_application_statement":
                return ModelicaFunctionApplicationStatementSyntax.new(source);

            case "function_partial_application":
                return ModelicaFunctionPartialApplicationExpressionSyntax.new(source);

            case "IDENT":
                return ModelicaIdentifierSyntax.new(source);

            case "if_equation":
                return ModelicaIfEquationSyntax.new(source);

            case "if_expression":
                return ModelicaIfExpressionSyntax.new(source);

            case "if_statement":
                return ModelicaIfStatementSyntax.new(source);

            case "import_clause":
                return ModelicaImportClauseSyntax.new(source);

            case "language_specification":
                return ModelicaLanguageSpecificationSyntax.new(source);

            case "logical_literal_expression":
                return ModelicaLogicalLiteralExpressionSyntax.new(source);

            case "long_class_specifier":
                return ModelicaLongClassSpecifierSyntax.new(source);

            case "modification":
                return ModelicaModificationSyntax.new(source);

            case "multiple_output_function_application_statement":
                return ModelicaMultipleOutputFunctionApplicationStatementSyntax.new(source);

            case "name":
                return ModelicaNameSyntax.new(source);

            case "named_argument":
                return ModelicaNamedArgumentSyntax.new(source);

            case "named_element":
                return ModelicaNamedElementSyntax.new(source);

            case "parenthesized_expression":
                return ModelicaParenthesizedExpressionSyntax.new(source);

            case "range_expression":
                return ModelicaRangeExpressionSyntax.new(source);

            case "return_statement":
                return ModelicaReturnStatementSyntax.new(source);

            case "short_class_definition":
                return ModelicaShortClassDefinitionSyntax.new(source);

            case "short_class_specifier":
                return ModelicaShortClassSpecifierSyntax.new(source);

            case "simple_equation":
                return ModelicaSimpleEquationSyntax.new(source);

            case "stored_definitions":
                return ModelicaStoredDefinitionSyntax.new(source);

            case "string_literal_expression":
                return ModelicaStringLiteralExpressionSyntax.new(source);

            case "subscript":
                return ModelicaSubscriptSyntax.new(source);

            case "type_specifier":
                return ModelicaTypeSpecifierSyntax.new(source);

            case "unary_expression":
                return ModelicaUnaryExpressionSyntax.new(source);

            case "unsigned_integer_literal_expression":
                return ModelicaUnsignedIntegerLiteralExpressionSyntax.new(source);

            case "unsigned_real_literal_expression":
                return ModelicaUnsignedRealLiteralExpressionSyntax.new(source);

            case "when_equation":
                return ModelicaWhenEquationSyntax.new(source);

            case "when_statement":
                return ModelicaWhenStatementSyntax.new(source);

            case "while_statement":
                return ModelicaWhileStatementSyntax.new(source);

            default:
                return undefined;

        }

    }

    abstract parse(): void;

    protected get parsed(): boolean {
        return this.#parsed;
    }

    protected set parsed(parsed: boolean) {
        this.#parsed = parsed;
    }

    get source(): SyntaxNode | null | undefined {
        return this.#source;
    }

}