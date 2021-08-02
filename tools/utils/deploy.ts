/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import * as fs from 'fs';
import * as path from 'path';

import * as program from 'commander';
import { copySync } from 'fs-extra';

import { distDir, execute, isCmdValid, projDir, resolveHome } from './util';

const DEFAULT_APP = 'playitforward';
const TIME = new Date().toISOString();

enum buildFlavors {
  'pro' = 'pro',
  'sta' = 'sta',
}

function getInfo() {
  return {
    pro: {
      name: 'Production',
      env: 'production',
      repo: 'main',
      bucket: 's3://app.playitforward.io',
      appPath: path.join(projDir, 'apps', program.app),
      buildPath: path.join(distDir, program.app, 'production'),
    },
    sta: {
      name: 'Staging',
      env: 'staging',
      repo: 'ci',
      bucket: 's3://sta.playitforward.io',
      appPath: path.join(projDir, 'apps', program.app),
      buildPath: path.join(distDir, program.app, 'staging'),
    },
  };
}

async function getFiles() {
  const info = await getInfo();
  return [
    {
      from: `${info[program.flavor].appPath}/src/assets/robots.txt`,
      to: `${info[program.flavor].buildPath}/robots.txt`,
    },
    {
      from: `${info[program.flavor].appPath}/src/favicon.ico`,
      to: `${info[program.flavor].buildPath}/favicon.ico`,
    },
  ];
}

async function s3cmdInstalled() {
  await isCmdValid('s3cmd').catch((err) => {
    throw Error(`***** Please install s3cmd **** `);
  });
}

async function update() {
  if (program.update) {
    await execute(`git checkout`, { dry: program.dry });
    await execute(`git pull`, { dry: program.dry });
  }
}

async function build() {
  const info = await getInfo();
  const cmdParts = [
    'build',
    program.app,
    `--configuration=${info[program.flavor].env}`,
    '--prod',
    `--output-path=${info[program.flavor].buildPath}`,
  ];
  if (program.sourcemap) {
    cmdParts.push(`--source-map`);
  }
  await execute(`yarn build ${cmdParts.join(' ')}`, { dry: program.dry });
}

async function copy() {
  const info = await getInfo();
  const files = await getFiles();

  for (const file of files) {
    if (program.dry) {
      console.log(`cp to build folder: ${file}`);
    } else {
      if (fs.existsSync(file.from)) {
        await copySync(file.from, file.to);
      } else {
        console.error(`Missing file ${file}`);
      }
    }
  }
}

async function deploy() {
  const info = await getInfo();
  if (!fs.existsSync(info[program.flavor].buildPath)) {
    throw Error(`Missing build directory. (${info[program.flavor].buildPath})`);
  }

  await copy();

  // copy all files except the index.html
  const exclude = [
    '--exclude="assets/css/*"',
    '--exclude="assets/fonts/*"',
    '--exclude="assets/icons/*"',
    '--exclude="assets/images/*"',
  ];
  let cmdParts = [
    'put',
    `${info[program.flavor].buildPath}/*`,
    `${info[program.flavor].bucket}`,
    '--recursive',
    '--exclude="index.html"',
    '--no-preserve',
    `--config=${resolveHome('~/aws/.s3cfg')}`,
  ];
  if (!program.all) {
    cmdParts = [...cmdParts, ...exclude];
  }
  await execute(`s3cmd ${cmdParts.join(' ')}`, { dry: program.dry });

  // backup index.html in case a revert is required
  cmdParts = [
    'cp',
    `${info[program.flavor].bucket}/index.html`,
    `${info[program.flavor].bucket}/index_${TIME}.html`,
    '--no-preserve',
    `--config=${resolveHome('~/aws/.s3cfg')}`,
  ];
  try {
    await execute(`s3cmd ${cmdParts.join(' ')}`, { dry: program.dry });
  } catch {
    console.log('index.html not found, must be initial deploy.');
  }

  // replace the index.html file
  cmdParts = [
    'put',
    `${info[program.flavor].buildPath}/index.html`,
    `${info[program.flavor].bucket}`,
    '--add-header="Cache-Control:public, must-revalidate, proxy-revalidate, s-maxage=0, max-age=0"',
    '--no-preserve',
    `--config=${resolveHome('~/aws/.s3cfg')}`,
  ];
  await execute(`s3cmd ${cmdParts.join(' ')}`, { dry: program.dry });

  // lastly invalidate any files that have changed from cloudfront cache.
  cmdParts = [
    'sync',
    `${info[program.flavor].buildPath}/index.html`,
    `${info[program.flavor].bucket}`,
    '--acl-public',
    '--cf-invalidate',
    `--config=${resolveHome('~/aws/.s3cfg')}`,
  ];
  await execute(`s3cmd ${cmdParts.join(' ')}`, { dry: program.dry });
}

async function main() {
  program.app = program.app || DEFAULT_APP;
  program.flavor = program.flavor || 'staging';

  const info = await getInfo();

  await s3cmdInstalled();

  if (!program.flavor) {
    throw Error(`Missing flavor. Choices are (${Object.keys(info)})`);
  }

  if (!info.hasOwnProperty(program.flavor)) {
    throw Error(`Invalid flavor. Choices are (${Object.keys(info)})`);
  }

  if (!program.update && !program.build && !program.deploy) {
    throw Error(`Please provide an action. Option --help for usage.`);
  }

  if (program.update) {
    await update();
  }

  if (program.build) {
    await build();
  }

  if (program.deploy) {
    await deploy();
  }
}

program
  .version('0.0.1', '-v, --version')
  .option('-b, --build', 'Build load')
  .option('-a, --app <name>', 'Build load')
  .option('-f, --flavor <type>', 'Build flavors (pro, sta)')
  .option('-s, --sourcemap', 'Build with sourcemap')
  .option('-d, --deploy', 'Deploy build')
  .option('-u, --update', 'Update repository prior to builds')
  .option('--all', 'Deploys & updates everything including assets')
  .option('--dry', 'Run commands without execution')
  .parse(process.argv);

main().catch((err) => {
  console.error(`Error building (${program.flavor})`);
  console.error(err?.message);
  process.exit(1);
});
