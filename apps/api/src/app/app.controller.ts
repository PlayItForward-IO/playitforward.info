/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Controller, Get } from '@nestjs/common';
import type { HealthCheck } from '@playitforward/agx-dto';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(readonly appService: AppService) {}

  @Get('ping')
  ping(): HealthCheck {
    return this.appService.ping();
  }
}
