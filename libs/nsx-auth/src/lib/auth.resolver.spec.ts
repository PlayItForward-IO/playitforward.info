/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { I18nService } from '@playitforward/nsx-i18n';
import { MailerService } from '@playitforward/nsx-mailer';
import { PrismaService } from '@playitforward/nsx-prisma';
import { getMockPrismaService } from '@playitforward/nsx-prisma/mock';

import { AuthResolver } from './auth.resolver';
import { SecurityService } from './auth.security.service';
import { AuthService } from './auth.service';

describe('AuthResolver', () => {
  let service: AuthResolver;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ConfigService,
        { provide: PrismaService, useValue: getMockPrismaService() },
        I18nService,
        MailerService,
        AuthService,
        SecurityService,
        AuthResolver,
      ],
    }).compile();

    service = module.get(AuthResolver);
  });

  afterAll(() => {
    service = null;
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
