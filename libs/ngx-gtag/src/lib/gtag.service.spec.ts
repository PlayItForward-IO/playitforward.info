/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { DOCUMENT } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigModule } from '@playitfoward/ngx-config';
import { LoggerModule } from '@playitfoward/ngx-logger';

import { GTagModule } from './gtag.module';
import { GTagService } from './gtag.service';

// disable console log during test
jest.spyOn(console, 'log').mockImplementation(() => undefined);

describe('GTagService', () => {
  let service: GTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        ConfigModule.forRoot(),
        LoggerModule,
        GTagModule,
      ],
      providers: [
        {
          provide: DOCUMENT,
          useValue: {},
        },
      ],
    });

    service = TestBed.inject(GTagService);
  });

  afterAll(() => {
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
