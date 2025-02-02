/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import {
  ApplicationConfig,
  ConfigService,
  DefaultApplicationConfig,
} from '@playitforward/ngx-config';
import { LoggerService } from '@playitforward/ngx-logger';
import { merge as ldNestedMerge } from 'lodash-es';
import { DeepReadonly } from 'ts-essentials';

import { GraphQLClient } from './gql.client';
import { DefaultGqlConfig } from './gql.default';

@Injectable({ providedIn: 'root' })
export class GqlService implements OnDestroy {
  private nameSpace = 'GQL';
  options: DeepReadonly<ApplicationConfig> = DefaultApplicationConfig;
  client: DeepReadonly<GraphQLClient>;

  constructor(
    readonly http: HttpClient,
    readonly config: ConfigService,
    readonly logger: LoggerService
  ) {
    this.options = ldNestedMerge({ gql: DefaultGqlConfig }, this.config.options);
    this.client = new GraphQLClient(this.http, this.options.gql.endpoint);
    this.logger.info(`[${this.nameSpace}] GqlService ready ...`);
  }

  ngOnDestroy() {
    this.client = undefined;
  }
}
