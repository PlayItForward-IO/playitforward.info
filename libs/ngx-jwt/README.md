# @playitforward/ngx-jwt <img style="margin-bottom: -6px" width="30" src="../../libs/agx-assets/src/lib/images/tech/playitforward-x250.png">

**A simple JWT library for Angular applications**

[![status-image]][status-link]
[![version-image]][version-link]
[![coverage-image]][coverage-link]
[![download-image]][download-link]

# Overview

## Description

This library helps with verification and payload extraction of JWT tokens

**@playitforward/ngx-jwt** attempts to streamline the jwt operation of your Angular application, while promoting DRY **DRY**.

# How to install

    npm i @playitforward/ngx-jwt |OR| yarn add @playitforward/ngx-jwt

# How to use

```typescript
// In your environment{prod,staging}.ts

import { ApplicationConfig } from '@playitforward/ngx-config';
import { LogLevel } from '@playitforward/ngx-logger';

export const environment: ApplicationConfig = {
  // app name
  appName: '@playitforward/ngx-jwt',
  // production, staging or development
  production: false,
  log: {
    // log level (application-wide)
    level: LogLevel.debug,
  },
  jwt: {
    // estimate time of http request between client -> server (greater than zero)
    networkDelay: 1,
    // backend may honor expired request arrive `x` seconds after expiry
    expiryLeeway: 5,
  },
};
```

```typescript
// In your app.module.ts

import { ConfigModule } from '@playitforward/ngx-config';
import { LoggerModule } from '@playitforward/ngx-logger';
import { JwtModule } from '@playitforward/ngx-jwt';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ConfigModule.forRoot(environment), // make the environment injectable
    LoggerModule,
    JwtModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

```typescript
// In your app.module.ts

import { Component } from '@angular/core';
import { ConfigService } from '@playitforward/ngx-config';
import { LoggerService } from '@playitforward/ngx-logger';
import { JwtService } from '@playitforward/ngx-jwt';

@Component({
  selector: 'playitforward-root',
  template: `<h1>Welcome to {{ title }}!</h1>`,
})
export class AppComponent {
  title = 'playitforward';
  options = {};
  constructor(
    readonly config: ConfigService,
    readonly logger: LoggerService,
    readonly jwt: JwtService
  ) {
    this.title = this.config.options.appName;

    this.logger.info('AppComponent loaded ...');

    const someToken = 'some-jwt-token-received-from-server'; // <part-1>.<part-2>.<part-2>
    const payload = this.jwt.getPayload(someToken);
    const isExpired = this.jwt.isExpired(payload);
    if (!isExpired) {
      const userId = payload.sub;
      const nextRefresh = this.jwt.getRefreshTime(payload);
      setTimeout(() => {
        // connect to the server to get a new token
      }, nextRefresh * 1000);
    }
  }
}
```

# License

Released under a ([MIT](https://raw.githubusercontent.com/neekware/playitforward/main/LICENSE)) license.

# Version

X.Y.Z Version

    `MAJOR` version -- making incompatible API changes
    `MINOR` version -- adding functionality in a backwards-compatible manner
    `PATCH` version -- making backwards-compatible bug fixes

[status-image]: https://github.com/neekware/playitforward/actions/workflows/ci.yml/badge.svg
[status-link]: https://github.com/neekware/playitforward/actions/workflows/ci.yml
[version-image]: https://img.shields.io/npm/v/@playitforward/ngx-jwt.svg
[version-link]: https://www.npmjs.com/package/@playitforward/ngx-jwt
[coverage-image]: https://coveralls.io/repos/neekware/playitforward/badge.svg
[coverage-link]: https://coveralls.io/r/neekware/playitforward
[download-image]: https://img.shields.io/npm/dm/@playitforward/ngx-jwt.svg
[download-link]: https://www.npmjs.com/package/@playitforward/ngx-jwt
