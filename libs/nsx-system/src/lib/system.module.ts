/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Module } from '@nestjs/common';
import { I18nModule } from '@playitforward/nsx-i18n';
import { MailerModule } from '@playitforward/nsx-mailer';
import { PrismaModule } from '@playitforward/nsx-prisma';

import { SystemController } from './system.controller';
import { SystemResolver } from './system.resolver';
import { SystemService } from './system.service';

@Module({
  imports: [PrismaModule, I18nModule, MailerModule],
  controllers: [SystemController],
  providers: [SystemService, SystemResolver],
  exports: [SystemService, SystemResolver],
})
export class SystemModule {}
