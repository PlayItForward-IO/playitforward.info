/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MsgService } from '@playitforward/ngx-msg';

@NgModule({
  imports: [CommonModule],
  providers: [MsgService],
})
export class SystemModule {}
