import { SourceFile, Node, ts } from 'ts-morph';

const operatorImport = 'rxjs/operators';
const operatorsWithSelector = [
  'concatMap',
  'concatMapTo',
  'exhaustMap',
  'mergeMap',
  'mergeMapTo',
  'switchMap',
  'switchMapTo',
];

export function resultSelector(sourceFile: SourceFile) {
  let selectorUpdated = false;
  let hasMapImported = false;

  const importDeclarations = sourceFile.getImportDeclarations();
  for (const importDeclaration of importDeclarations) {
    if (importDeclaration.getModuleSpecifierValue() !== operatorImport) {
      continue;
    }

    const operatorImportNodes = importDeclaration.getNamedImports();
    for (const operatorImportNode of operatorImportNodes) {
      hasMapImported =
        hasMapImported || operatorImportNode.compilerNode.name.text == 'map';
      if (
        !operatorsWithSelector.includes(
          operatorImportNode.compilerNode.name.text
        )
      ) {
        continue;
      }

      const node = operatorImportNode.getNameNode();
      for (const ref of node.findReferencesAsNodes()) {
        const parent = ref.getParent();
        if (!parent || !Node.isCallExpression(parent)) {
          continue;
        }

        const [projector, ...args] = parent.getArguments();
        const projectorText = projector.getText();
        for (const arg of args) {
          if (!Node.isArrowFunction(arg) && !Node.isFunctionExpression(arg)) {
            continue;
          }
          const selectorText = arg.getText();
          parent.removeArgument(arg);
          parent.removeArgument(projector);
          parent.insertArgument(
            0,
            `${projectorText}.pipe(map(${selectorText}))`
          );
          selectorUpdated = true;
          break;
        }
      }
    }
  }

  if (selectorUpdated && !hasMapImported) {
    for (const importDeclaration of importDeclarations) {
      if (importDeclaration.getModuleSpecifierValue() === operatorImport) {
        importDeclaration.addNamedImport('map');
      }
    }
  }
  return selectorUpdated;
}
