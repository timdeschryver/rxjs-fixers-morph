import { SourceFile, Node, ts } from 'ts-morph';

export function subscribeSignature(sourceFile: SourceFile) {
  let signatureUpdated = false;

  const childNodes = sourceFile.getChildren();
  for (const childNode of childNodes) {
    lookForSubscribe(childNode);
  }
  return signatureUpdated;

  function lookForSubscribe(node: Node<ts.Node>) {
    if (
      Node.isPropertyAccessExpression(node) &&
      node.compilerNode.name.text === 'subscribe'
    ) {
      const parent = node.getParent();
      if (!Node.isCallExpression(parent)) {
        return;
      }

      const args = parent.getArguments();
      if (args.length <= 1) {
        return;
      }

      let updatedSignatures = [];
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
    } else {
      for (const childNode of node.getChildren()) {
        lookForSubscribe(childNode);
      }
    }
  }
}
