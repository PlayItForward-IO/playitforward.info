/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from '@playitforward/nsx-auth';
import { HttpRequest, HttpResponse } from '@playitforward/nsx-common';
import { MailerModule } from '@playitforward/nsx-mailer';
import { PrismaModule } from '@playitforward/nsx-prisma';
import { SystemModule } from '@playitforward/nsx-system';
import { UserModule } from '@playitforward/nsx-user';

import { environment } from '../environments/environment';
import { appConfiguration } from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      ...environment.appConfig,
      load: [appConfiguration],
    }),
    PrismaModule,
    MailerModule,
    SystemModule,
    AuthModule,
    UserModule,
    GraphQLModule.forRoot({
      ...environment.graphqlConfig,
      context: ({ req, res }) => ({
        request: req as HttpRequest,
        response: res as HttpResponse,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [ConfigService, AppService],
  exports: [ConfigService],
})
export class AppModule {}
