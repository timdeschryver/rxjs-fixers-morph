import { SourceFile } from 'ts-morph';

const operatorImport = 'rxjs/operators';
const deprecatedOperators = ['zip', 'combineLatest', 'merge', 'concat', 'race'];

export function operatorWithRename(sourceFile: SourceFile) {
  let operatorIsRenamed = false;

  const importDeclarations = sourceFile.getImportDeclarations();
  for (const importDeclaration of importDeclarations) {
    if (importDeclaration.getModuleSpecifierValue() !== operatorImport) {
      continue;
    }

    const operatorImportNodes = importDeclaration.getNamedImports();
    for (const operatorImportNode of operatorImportNodes) {
      if (
        deprecatedOperators.includes(operatorImportNode.compilerNode.name.text)
      ) {
        const newName = `${operatorImportNode.compilerNode.name.text}With`;
        let nameNode = operatorImportNode.getNameNode();
        nameNode.rename(newName);
        operatorIsRenamed = true;
      }
    }
  }

  return operatorIsRenamed;
}
