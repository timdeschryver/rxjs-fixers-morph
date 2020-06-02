var fs = require('fs');
var cp = require('child_process');

test.each([
  'operator-with-rename',
  'result-selectors',
  'subscribe-signature',
  'tap-signature',
])(
  '%s',
  async (fileName) => {
    const input = `./sandbox/input/${fileName}.ts`;
    const actualOutput = `./sandbox/actual-output/${fileName}.ts`;
    const expectedOutput = `./sandbox/expected-output/${fileName}.ts`;

    fs.copyFileSync(input, actualOutput);

    await npm(['run start']);

    const contentAfterFix = fs.readFileSync(actualOutput, 'utf8');
    const expectedContent = fs.readFileSync(expectedOutput, 'utf8');
    expect(contentAfterFix).toBe(expectedContent);
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
