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

import { AuthGuardRole } from './auth.guard.role';
import { SecurityService } from './auth.security.service';

describe('AuthGuardRole', () => {
  let service: AuthGuardRole;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: PrismaService, useValue: getMockPrismaService() },
        ConfigService,
        SecurityService,
        AuthGuardRole,
      ],
    }).compile();

    service = module.get(AuthGuardRole);
  });

  afterAll(() => {
    service = null;
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
