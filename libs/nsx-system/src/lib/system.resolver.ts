/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ConfigService } from '@nestjs/config';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RequestDecorator } from '@playitforward/nsx-auth';
import { ApplicationConfig, HttpRequest } from '@playitforward/nsx-common';
import { I18nService } from '@playitforward/nsx-i18n';
import { MailerService } from '@playitforward/nsx-mailer';
import { PrismaService } from '@playitforward/nsx-prisma';
import { DeepReadonly } from 'ts-essentials';

import { SystemContactUsInput, SystemStatusDto } from './system.model';
import { SystemService } from './system.service';

@Resolver(() => SystemStatusDto)
export class SystemResolver {
  readonly options: DeepReadonly<ApplicationConfig>;

  constructor(
    readonly config: ConfigService,
    readonly systemService: SystemService,
    readonly prisma: PrismaService,
    readonly mailer: MailerService,
    readonly i18n: I18nService
  ) {
    this.options = this.config.get<ApplicationConfig>('appConfig');
  }

  @Mutation(() => SystemStatusDto)
  async systemContactUs(
    @RequestDecorator() request: HttpRequest,
    @Args('input') payload: SystemContactUsInput
  ) {
    const user = request.user;
    const name = user ? `${user.firstName} ${user.lastName}` : payload.name;
    const email = user ? user.email : payload.email;

    this.mailer.sendMail({
      from: this.options.siteSupportEmail,
      to: email,
      subject: `${payload.subject} - (from: ${name})`,
      text: payload.body,
    });

    return { ok: true };
  }
}
