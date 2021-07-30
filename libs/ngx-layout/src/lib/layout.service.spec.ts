/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { TestBed, inject } from '@angular/core/testing';
import { ApplicationConfig, ConfigModule } from '@playitfoward/ngx-config';
import { LoggerModule } from '@playitfoward/ngx-logger';

import { LayoutService } from './layout.service';

export const applicationConfig: ApplicationConfig = {
  appName: 'playitfoward',
  production: false,
  log: {
    enabled: true,
  },
  gql: { endpoint: '/api/gql' },
};

xdescribe('LayoutService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConfigModule.forRoot(applicationConfig), LoggerModule],
      providers: [LayoutService],
    });
  });

  it('should be created', inject([LayoutService], (service: LayoutService) => {
    expect(service).toBeTruthy();
  }));
});
