/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HealthCheck } from '@playitfoward/agx-dto';
import { AuthService } from '@playitfoward/ngx-auth';
import { ConfigService } from '@playitfoward/ngx-config';
import { I18nService } from '@playitfoward/ngx-i18n';
import { LayoutService } from '@playitfoward/ngx-layout';
import { LoggerService } from '@playitfoward/ngx-logger';
import { StoreService } from '@playitfoward/ngx-store';
import { SystemService } from '@playitfoward/ngx-system';
import { UixService } from '@playitfoward/ngx-uix';
import { UserService } from '@playitfoward/ngx-user';
import { Observable } from 'rxjs';

@Component({
  selector: 'playitfoward-root',
  template: '<playitfoward-layout></playitfoward-layout>',
})
export class AppComponent implements OnInit {
  healthCheck$: Observable<HealthCheck>;

  constructor(
    readonly http: HttpClient,
    readonly config: ConfigService,
    readonly logger: LoggerService,
    readonly store: StoreService,
    readonly auth: AuthService,
    readonly i18n: I18nService,
    readonly uix: UixService,
    readonly layout: LayoutService,
    readonly user: UserService,
    readonly system: SystemService
  ) {
    if (!this.config.options.production) {
      /* istanbul ignore next */
      this.logger.info('AppComponent starting ... ');
    }
  }

  ngOnInit(): void {
    this.healthCheck$ = this.http.get<HealthCheck>('/api/ping');
  }
}
