var fs = require('fs');
var cp = require('child_process');

test.each(fs.readdirSync('./sandbox').filter((p) => !p.endsWith('.json')))(
  '%s',
  async (fixer) => {
    const input = `./sandbox/${fixer}/input.ts`;
    const output = `./sandbox/${fixer}/output.ts`;
    const transformed = `./sandbox/${fixer}/transformed.ts`;

    fs.copyFileSync(input, transformed);

    await npm(['run sandbox', '"./sandbox/tsconfig.sandbox.json"']);

    const transformedContent = fs.readFileSync(transformed, 'utf8');
    const expectedContent = fs.readFileSync(output, 'utf8');
    expect(transformedContent).toBe(expectedContent);
  },
  30_000
);

function npm(args) {
  return exec('npm', args);
}

function exec(command, args) {
  return new Promise((resolve, reject) => {
    cp.exec(command + ' ' + args.join(' '), (err, stdout) => {
      if (err) {
        return reject(err);
      }

      resolve(stdout.toString());
    });
  });
}
