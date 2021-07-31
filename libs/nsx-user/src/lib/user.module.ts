/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Global, Module } from '@nestjs/common';
import { AuthModule } from '@playitforward/nsx-auth';
import { I18nModule } from '@playitforward/nsx-i18n';
import { MailerModule } from '@playitforward/nsx-mailer';
import { PrismaModule } from '@playitforward/nsx-prisma';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Global()
@Module({
  imports: [AuthModule, PrismaModule, I18nModule, MailerModule],
  providers: [UserService, UserResolver],
  exports: [UserService, UserResolver],
})
export class UserModule {}
