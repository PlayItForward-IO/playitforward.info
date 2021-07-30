# @playitfoward/ngx-jwt <img style="margin-bottom: -6px" width="30" src="../../libs/agx-assets/src/lib/images/tech/playitfoward-x250.png">

**A simple JWT library for Angular applications**

[![status-image]][status-link]
[![version-image]][version-link]
[![coverage-image]][coverage-link]
[![download-image]][download-link]

# Overview

## Description

This library helps with verification and payload extraction of JWT tokens

**@playitfoward/ngx-jwt** attempts to streamline the jwt operation of your Angular application, while promoting DRY **DRY**.

# How to install

    npm i @playitfoward/ngx-jwt |OR| yarn add @playitfoward/ngx-jwt

# How to use

```typescript
// In your environment{prod,staging}.ts

import { ApplicationConfig } from '@playitfoward/ngx-config';
import { LogLevel } from '@playitfoward/ngx-logger';

export const environment: ApplicationConfig = {
  // app name
  appName: '@playitfoward/ngx-jwt',
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

import { ConfigModule } from '@playitfoward/ngx-config';
import { LoggerModule } from '@playitfoward/ngx-logger';
import { JwtModule } from '@playitfoward/ngx-jwt';

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
import { ConfigService } from '@playitfoward/ngx-config';
import { LoggerService } from '@playitfoward/ngx-logger';
import { JwtService } from '@playitfoward/ngx-jwt';

@Component({
  selector: 'playitfoward-root',
  template: `<h1>Welcome to {{ title }}!</h1>`,
})
export class AppComponent {
  title = 'playitfoward';
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

Released under a ([MIT](https://raw.githubusercontent.com/neekware/playitfoward/main/LICENSE)) license.

# Version

X.Y.Z Version

    `MAJOR` version -- making incompatible API changes
    `MINOR` version -- adding functionality in a backwards-compatible manner
    `PATCH` version -- making backwards-compatible bug fixes

[status-image]: https://github.com/neekware/playitfoward/actions/workflows/ci.yml/badge.svg
[status-link]: https://github.com/neekware/playitfoward/actions/workflows/ci.yml
[version-image]: https://img.shields.io/npm/v/@playitfoward/ngx-jwt.svg
[version-link]: https://www.npmjs.com/package/@playitfoward/ngx-jwt
[coverage-image]: https://coveralls.io/repos/neekware/playitfoward/badge.svg
[coverage-link]: https://coveralls.io/r/neekware/playitfoward
[download-image]: https://img.shields.io/npm/dm/@playitfoward/ngx-jwt.svg
[download-link]: https://www.npmjs.com/package/@playitfoward/ngx-jwt
