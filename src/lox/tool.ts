import path from "path";
import fs from "fs";

class GenerateAst {
  static main(args: string[]) {
    if (args.length !== 1) {
      console.error("Usage: generate_ast <output directory>");
      process.exit(64);
    }
    const outputDir = args[0];
    this.defineAst(outputDir, "Expr", [
      "Assign   : name Token, value Expr",
      "Binary   : left Expr, operator Token, right Expr",
      "Grouping : expression Expr",
      "Literal  : value any",
      "Unary    : operator Token, right Expr",
    ]);
  }

  static defineAst(outputDir: string, baseName: string, types: string[]) {
    let text = ``;
    const filepath = path.join(outputDir, `${baseName}.ts`);
    text += `abstract class ${baseName} {\n`

    text += `}\n`;
    fs.writeFile(filepath, text, "utf8", (err) => {
      if (err) {
        console.error("写入文件时出错:", err);
        return;
      }
      console.log("文件已成功写入");
    });
  }
}

console.log(process.argv);
// GenerateAst.main(process.argv.slice(2));