import { Project } from 'ts-morph';
import { operatorWithRename } from './operator-with-rename';
import { tagSignature } from './tap-signature';
import { subscribeSignature } from './subscribe-signature';
import { resultSelector } from './result-selectors';

const tsConfigPath = process.argv.slice(2)[0] || './tsconfig.json';

const project = new Project({
  tsConfigFilePath: tsConfigPath,
});

const sourceFiles = project.getSourceFiles();
for (const sourceFile of sourceFiles) {
  const fixers = [
    operatorWithRename,
    tagSignature,
    subscribeSignature,
    resultSelector,
  ];
  const updated = fixers.reduce(
    (res, fixer) => fixer(sourceFile) || res,
    false
  );

  if (updated) {
    sourceFile.saveSync();
  }
}
