/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@playitforward/nsx-prisma';
import { getMockPrismaService } from '@playitforward/nsx-prisma/mock';

import { AuthGuardPermission } from './auth.guard.permission';
import { SecurityService } from './auth.security.service';

describe('AuthGuardPermission', () => {
  let service: AuthGuardPermission;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: PrismaService, useValue: getMockPrismaService() },
        ConfigService,
        SecurityService,
        AuthGuardPermission,
      ],
    }).compile();

    service = module.get(AuthGuardPermission);
  });

  afterAll(() => {
    service = null;
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
