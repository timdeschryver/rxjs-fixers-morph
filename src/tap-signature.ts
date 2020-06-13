import { SourceFile, Node, ts } from 'ts-morph';

const operatorImport = 'rxjs/operators';
const tapOperator = 'tap';

export function tagSignature(sourceFile: SourceFile) {
  let signatureUpdated = false;

  const importDeclarations = sourceFile.getImportDeclarations();
  for (const importDeclaration of importDeclarations) {
    if (importDeclaration.getModuleSpecifierValue() !== operatorImport) {
      continue;
    }

    const operatorImportNodes = importDeclaration.getNamedImports();
    for (const operatorImportNode of operatorImportNodes) {
      if (operatorImportNode.compilerNode.name.text !== tapOperator) {
        continue;
      }

      const node = operatorImportNode.getNameNode();
      for (const ref of node.findReferencesAsNodes()) {
        const parent = ref.getParent();
        if (!parent || !Node.isCallExpression(parent)) {
          continue;
        }

        const args = parent.getArguments();
        if (args.length <= 1) {
          continue;
        }

        let updatedSignatures: string[] = [];
        const updateSignature = (node: Node<ts.Node>, propertyName: string) => {
          if (!node) {
            return;
          }

          const text = node.getText();
          if (['null', 'undefined'].includes(text.trim())) {
            updatedSignatures.push(`${propertyName}: () => {}`);
          } else {
            updatedSignatures.push(`${propertyName}: ${text}`);
          }

          parent.removeArgument(node);
        };

        const [next, error, complete] = args;
        updateSignature(next, 'next');
        updateSignature(error, 'error');
        updateSignature(complete, 'complete');

        parent.addArgument(`{${updatedSignatures.join(', ')}}`);
        signatureUpdated = true;
      }
    }
  }

  return signatureUpdated;
}
