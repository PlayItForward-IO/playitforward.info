/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ConfigModule } from '@playitfoward/ngx-config';

import { StoreModule } from './store.module';
import { StoreService } from './store.service';

// disable console log/warn during test
jest.spyOn(console, 'log').mockImplementation(() => undefined);

describe('StoreService', () => {
  let service: StoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ConfigModule.forRoot({
          production: false,
        }),
        StoreModule,
      ],
    });

    service = TestBed.inject(StoreService);
  });

  afterAll(() => {
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
