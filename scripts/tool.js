
import path from "path";
import fs from "fs";

class Writer {
  #buffer = [];

  println(message, indent) {

    if (message != null) {

        if (indent != null)
            this.write(" ".repeat(indent));
        this.write(message);

    }

    this.write("\n");

}

  toString() {
      return this.#buffer.join("");
  }

   write(message) {
      this.#buffer.push(message);
  }
}

const writer = new Writer();

class GenerateAst {
  static main(args) {
    if (args.length !== 1) {
      console.error("Usage: generate_ast <output directory>");
      process.exit(64);
    }
    const outputDir = args[0];
    this.defineAst(outputDir, "Expr", [
      "Assign   : name: Token, value: Expr",
      "Binary   : left:: Expr, operator: Token, right: Expr",
      "Grouping : expression: Expr",
      "Literal  : value: any",
      "Unary    : operator: Token, right: Expr",
    ]);
  }

  static defineAst(outputDir, baseName, types) {
    const filepath = path.join(outputDir, `${baseName}.ts`);
    writer.println(`abstract class ${baseName} {`)
    
    for ( const type of types) {
      const className = type.split(":")[0].trim();
      const fields = type.split(":")[1].trim(); 
      this.defineType(writer, baseName, className, fields);
    }
    writer.println(`}`);
    fs.writeFile(filepath, writer.toString(), "utf8", (err) => {
      if (err) {
        console.error("写入文件时出错:", err);
        return;
      }
      console.log("文件已成功写入");
    });
  }

  static defineType(writer, baseName, className, fields) {
    const fields = fieldList.split(",");
    writer.println(" static class " + className + " extends " +
    baseName + " {");
    for (const field of fields) {
      writer.println("public " + field + ";");
    }

    // Constructor
    writer.println(` constructor(${fields})`);
    writer.println("  }");

  }
}

console.log(process.argv);
GenerateAst.main(process.argv.slice(2));
// GenerateAst.main(process.argv.slice(2));