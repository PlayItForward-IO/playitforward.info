/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { SnackbarStatus } from './snackbar/snackbar.model';

export interface MessageMap {
  [id: string]: {
    [id: string]: SnackbarStatus;
  };
}
