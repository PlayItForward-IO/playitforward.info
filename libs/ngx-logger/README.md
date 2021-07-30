# @playitfoward/ngx-logger <img style="margin-bottom: -6px" width="30" src="../../libs/agx-assets/src/lib/images/tech/playitfoward-x250.png">

**A simple logger module for Angular applications**

[![status-image]][status-link]
[![version-image]][version-link]
[![coverage-image]][coverage-link]
[![download-image]][download-link]

# Overview

## Description

Proper logging of events is one of the most important aspect of any proper software design and architecture. This is to `toggle` a flag and have a desired portion of the logic log their activities. This is a `MUST` during debugging sessions, or simply to report an error and send the log on `production` deployments.

**@playitfoward/ngx-logger** attempts to streamline the logging of your application, while promoting DRY **DRY**.

# How to install

    npm i @playitfoward/ngx-logger |OR| yarn add @playitfoward/ngx-logger

# How to use

```typescript
// In your environment{prod,staging}.ts

import {
  ApplicationConfig,
  TargetPlatform,
  HttpMethod,
} from '@playitfoward/ngx-config';

import { LogLevel } from '@playitfoward/ngx-logger';

export const environment: ApplicationConfig = {
  production: false,
  // one or more app specific field(s)
  logger: {
    // Log level, (default = none)
    // Anything above `info` will be logged, anything below will be skipped
    level: LogLevel.info,
  },
} as const;
```

```typescript
// In your app.module.ts

import { ConfigModule } from '@playitfoward/ngx-config';
import { LoggerModule } from '@playitfoward/ngx-logger';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ConfigModule.forRoot(environment),
    LoggerModule.forRoot(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

```typescript
// In your app.component.ts or (some.service.ts)

import { Component } from '@angular/core';
import { ConfigService } from '@playitfoward/ngx-config';
import { LoggerService } from '@playitfoward/ngx-logger';

@Component({
  selector: 'playitfoward-root',
})
export class AppComponent {
  title = 'PlayItForward';
  options: ApplicationConfig;

  constructor(readonly config: ConfigService, readonly log: LogService) {
    this.title = this.config.options.appName;

    this.log.critical('Logging critical');
    this.log.error('Logging error and above');
    this.log.warn('Logging warn and above');
    this.log.info('Logging info and above');
    this.log.debug('Logging debug and above');
    this.log.trace('Logging trace and above');
  }
}
```

# Sample logs

```
ConfigService ready ...
2018-05-17T02:47:54.184Z [INFO] LogService ready ...
2018-05-17T02:47:54.188Z [INFO] GqlService ready ...
2018-05-17T02:47:54.375Z [INFO] I18nService ready ... (en)
2018-05-17T02:47:54.378Z [INFO] UixService ready ...
2018-05-17T02:47:54.379Z [INFO] JwtService ready ...
2018-05-17T02:47:54.384Z [INFO] Token expiry ... (21 seconds)
2018-05-17T02:47:54.388Z [INFO] AuthService ready ... (loggedIn)
2018-05-17T02:47:54.390Z [INFO] UsrService ready ...
2018-05-17T02:47:54.392Z [INFO] Web app starting now ...
2018-05-17T02:47:54.406Z [INFO] LayoutService ready ...
```

# Note:

1. `@playitfoward/ngx-logger` depends on `@playitfoward/ngx-config` for accessing the log level.
2. You may want to set the log level to `LogLevel.debug` for development and `LogLevel.warn` for production.
3. `@playitfoward/ngx-logger` should be imported at the root level of your application.
4. To disable the logger, set the level to `LogLevel.none`, (default).

# License

Released under a ([MIT](https://raw.githubusercontent.com/neekware/playitfoward/main/LICENSE)) license.

# Version

X.Y.Z Version

    `MAJOR` version -- making incompatible API changes
    `MINOR` version -- adding functionality in a backwards-compatible manner
    `PATCH` version -- making backwards-compatible bug fixes

[status-image]: https://github.com/neekware/playitfoward/actions/workflows/ci.yml/badge.svg
[status-link]: https://github.com/neekware/playitfoward/actions/workflows/ci.yml
[version-image]: https://img.shields.io/npm/v/@playitfoward/ngx-logger.svg
[version-link]: https://www.npmjs.com/package/@playitfoward/ngx-logger
[coverage-image]: https://coveralls.io/repos/neekware/playitfoward/badge.svg
[coverage-link]: https://coveralls.io/r/neekware/playitfoward
[download-image]: https://img.shields.io/npm/dm/@playitfoward/ngx-logger.svg
[download-link]: https://www.npmjs.com/package/@playitfoward/ngx-logger
