/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import * as fs from 'fs';

import * as program from 'commander';
import * as replaceSection from 'markdown-replace-section';

import { execute } from './util';

const DEBUG = false;
const excludeDirs = ['node_modules', 'tmp', 'coverage', 'dist', 'gql.schema.ts', 'graph'];

/**
 * Note, the "Lines of Code" section cannot be at the end
 * https://github.com/renke/markdown-replace-section/issues/1
 */
async function main() {
  const loc = await execute(`loc . --exclude ${excludeDirs.join(' ')}`, !DEBUG);
  let readMe = fs.readFileSync('README_TECH.md', 'utf-8');

  readMe = replaceSection(readMe, 'Lines of Code', '```txt<br>' + loc + '```', false);

  fs.writeFileSync('README_TECH.md', readMe, 'utf-8');
}

program.version('0.0.1', '-v, --version').parse(process.argv);

main().catch((err) => {
  console.error(`Error updating README_TECH.md`, err);
  process.exit(111);
});
