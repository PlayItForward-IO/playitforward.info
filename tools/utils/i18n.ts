/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { writeFileSync } from 'fs';
import * as path from 'path';

import * as program from 'commander';
import { sync } from 'glob';

import { projDir, sleep } from './util';

const { v4: uuidv4 } = require('uuid');

const axios = require('axios').default;

export const I18nDefaultLanguage = 'en';
export const I18nActiveLanguages = ['en', 'de', 'fr', 'es', 'he', 'fa', 'zh-hans'];

export const I18nDirectory = path.join(projDir, 'libs/agx-assets/src/lib/i18n/client');
export const I18nFilePattern = path.join(I18nDirectory, '**/*.json');

interface I18nLanguageIsoPath {
  iso: string;
  path: string;
}

// This is azure cognitive service endpoint
const endpoint = 'https://api.cognitive.microsofttranslator.com';

// This is your azure subscription key
const subscriptionKey = process.env.AZURE_SUBSCRIPTION_KEY;

// This is required if using a Cognitive Services resource. Also known as region and default is (global)
const location = process.env.AZURE_RESOURCE_LOCATION;

async function translate(text: string, options: { from: string; to: string }): Promise<string> {
  return axios({
    baseURL: endpoint,
    url: '/translate',
    method: 'post',
    headers: {
      'Ocp-Apim-Subscription-Key': subscriptionKey,
      'Ocp-Apim-Subscription-Region': location,
      'Content-type': 'application/json',
      'X-ClientTraceId': uuidv4().toString(),
    },
    params: {
      'api-version': '3.0',
      from: options.from,
      to: options.to,
    },
    data: [{ text }],
    responseType: 'json',
  })
    .then(function (response) {
      return response?.data[0]?.translations[0]?.text;
    })
    .catch(function (error) {
      console.error(error);
      return null;
    });
}

/**
 * Reaches out to google and translate text
 * @param fromFile - full path to 'from' language json file
 * @param toFile - full path to 'to' language json file
 */
async function processLanguageFileTranslation(
  fromFile: I18nLanguageIsoPath,
  toFile: I18nLanguageIsoPath
) {
  const fromData = require(fromFile.path);
  const toData = require(toFile.path);

  let toPruned = {};
  if (program.prune) {
    for (const key in toData) {
      if (toData.hasOwnProperty(key) && fromData.hasOwnProperty(key)) {
        toPruned[key] = toData[key];
      }
    }
  } else {
    toPruned = toData;
  }

  let toNewData = {};
  if (program.translate) {
    for (const key in fromData) {
      const fromValue = fromData[key];
      const toValue = toPruned[key];

      if (fromValue && !toValue) {
        sleep(100);
        const result = await translate(fromData[key], {
          from: I18nDefaultLanguage,
          to: toFile.iso,
        });
        console.log(result);
        if (result) {
          toNewData[key] = result;
        }
      } else {
        toNewData[key] = toValue;
      }
    }
  } else {
    toNewData = toPruned;
  }

  const content = JSON.stringify(toNewData, null, 2);
  writeFileSync(toFile.path, content, 'utf-8');
}

function getFromLanguageFile(): I18nLanguageIsoPath {
  const filePath = path.join(I18nDirectory, `${I18nDefaultLanguage}.json`);
  return { iso: I18nDefaultLanguage, path: filePath };
}

function getToLanguageFiles(): I18nLanguageIsoPath[] {
  const translationFiles = sync(I18nFilePattern);
  const toLanguageFile: I18nLanguageIsoPath[] = [];

  for (const filePath of translationFiles) {
    for (const iso of I18nActiveLanguages) {
      if (iso !== I18nDefaultLanguage && filePath.endsWith(`${iso}.json`)) {
        toLanguageFile.push({ iso, path: filePath });
      }
    }
  }
  return toLanguageFile;
}

/**
 *  Translate files
 */
async function main(argv) {
  console.log('Processing translations (via azure) ...');

  if (program.translate || program.prune) {
    const fromFileInfo = getFromLanguageFile();
    const toFilesInfo = getToLanguageFiles();
    console.log(
      `Translating: from (${I18nDefaultLanguage}) => to: (${I18nActiveLanguages.filter(
        (iso) => iso !== I18nDefaultLanguage
      )})`
    );

    for (const toInfo of toFilesInfo) {
      await processLanguageFileTranslation(fromFileInfo, toInfo);
    }
  } else {
    console.log(program.help());
  }
}

program
  .version('0.0.1', '-v, --version')
  .option('--verbose', 'verbose')
  .option('-p, --prune', 'prunes alt-langs to match the default lang')
  .option('-t, --translate', 'translates from default lang to alt-langs')
  .parse(process.argv);

main(process.argv).catch((err) => {
  console.error(`Error translating languages`, err);
  process.exit(111);
});
