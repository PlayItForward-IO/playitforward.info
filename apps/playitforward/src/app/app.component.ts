/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HealthCheck } from '@playitforward/agx-dto';
import { AuthService } from '@playitforward/ngx-auth';
import { ConfigService } from '@playitforward/ngx-config';
import { I18nService } from '@playitforward/ngx-i18n';
import { LayoutService } from '@playitforward/ngx-layout';
import { LoggerService } from '@playitforward/ngx-logger';
import { StoreService } from '@playitforward/ngx-store';
import { SystemService } from '@playitforward/ngx-system';
import { UixService } from '@playitforward/ngx-uix';
import { UserService } from '@playitforward/ngx-user';
import { Observable } from 'rxjs';

@Component({
  selector: 'playitforward-root',
  template: '<playitforward-layout></playitforward-layout>',
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
