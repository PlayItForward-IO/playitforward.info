/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

import * as glob from 'glob';

require('dotenv').config();

export const projName = 'playitforward';
export const projDir = path.resolve(__dirname, '../..');
export const coverageDir = path.resolve(path.join(projDir, 'coverage'));
export const distDir = path.resolve(path.join(projDir, 'dist'));
export const projPkgJson = require(path.join(projDir, 'package.json'));

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export interface ExecuteOptions {
  debug?: boolean;
  dry?: boolean;
  silent?: boolean;
}

/**
 * Runs a command, capture and return the output
 * @param command {string} an executable command
 */
export function execute(command: string, options?: ExecuteOptions): Promise<any> {
  return new Promise((resolvePromise, rejectPromise) => {
    if (options?.dry && !options?.silent) {
      console.log(`Executing: ${command}`);
      resolvePromise(true);
    } else {
      if (options?.debug && !options?.silent) {
        console.log(`Executing: ${command}`);
      }
      childProcess.exec(command, { maxBuffer: 1024 * 1000 }, (error, stdout, stderr) => {
        if (error) {
          if (options?.silent !== true) {
            console.error(error);
          }
          rejectPromise(stderr);
        } else {
          resolvePromise(stdout);
        }
      });
    }
  });
}

/**
 *
 * @param filepath a path relevant to home directory
 */
export const resolveHome = (filepath: string): string => {
  if (filepath[0] === '~') {
    return path.join(process.env.HOME, filepath.slice(1));
  }
  return filepath;
};

/**
 * Checks if a file exists
 * @param filePath path to file
 */
export function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
}

/**
 * Returns a list of file name
 * @param globPattern pattern for globs
 */
export function getGlobFiles(globPattern): Promise<string[]> {
  // /**/error.log, /**/results.txt, ...etc
  return new Promise((resolve, reject) => {
    glob(globPattern, (error, result) => {
      if (error) {
        console.log(error);
        resolve([]);
      }
      resolve(result);
    });
  });
}

export const isCmdValid = async (cmd: string): Promise<boolean> => {
  return execute(`which ${cmd}`, { silent: true }).then((stdout) => {
    if (stdout.trim().length === 0) {
      return Promise.reject(new Error('No output'));
    }
    const rNotFound = /^[\w\-]+ not found/g;
    if (rNotFound.test(cmd)) {
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  });
};
