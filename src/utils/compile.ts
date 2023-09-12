import typescript from "typescript";
import * as fs from "fs";
import * as path from "path";

// Function to compile TypeScript files
export async function compile(outDir: string) {
  await fs.promises.rm(outDir, { recursive: true, force: true });

  const tsConfigPath = "./tsconfig.json";
  // Read tsconfig.json
  const configFile = typescript.readConfigFile(
    tsConfigPath,
    typescript.sys.readFile
  );

  // Parse JSON string to actual TypeScript compiler options
  const parsedCommandLine = typescript.parseJsonConfigFileContent(
    configFile.config,
    typescript.sys,
    path.dirname(tsConfigPath)
  );

  // Create a Program with an in-memory emit
  const program = typescript.createProgram(parsedCommandLine.fileNames, {
    ...parsedCommandLine.options,
    outDir,
  });

  // Emit the files
  const emitResult = program.emit();

  /// Report diagnostics
  let hasErrors = false;

  const allDiagnostics = typescript
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  allDiagnostics.forEach((diagnostic) => {
    const message = typescript.flattenDiagnosticMessageText(
      diagnostic.messageText,
      "\n"
    );

    if (diagnostic.file) {
      const { line, character } = typescript.getLineAndCharacterOfPosition(
        diagnostic.file,
        diagnostic.start!
      );
      if (diagnostic.category === typescript.DiagnosticCategory.Error) {
        hasErrors = true;
        throw new Error(
          `${diagnostic.file.fileName} (${line + 1},${
            character + 1
          }): ${message}`
        );
      } else {
        console.log(
          `Warning in ${diagnostic.file.fileName} (${line + 1},${
            character + 1
          }): ${message}`
        );
      }
    } else {
      if (diagnostic.category === typescript.DiagnosticCategory.Error) {
        hasErrors = true;
        throw new Error(message);
      } else {
        console.log(`Warning: ${message}`);
      }
    }
  });

  if (hasErrors) {
    throw new Error("TypeScript compilation failed.");
  }
}
