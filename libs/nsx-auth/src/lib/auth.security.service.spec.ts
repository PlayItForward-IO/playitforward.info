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

import { SecurityService } from './auth.security.service';

describe('SecurityService', () => {
  let service: SecurityService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ConfigService,
        { provide: PrismaService, useValue: getMockPrismaService() },
        SecurityService,
      ],
    }).compile();

    service = module.get(SecurityService);
  });

  afterAll(() => {
    service = null;
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
