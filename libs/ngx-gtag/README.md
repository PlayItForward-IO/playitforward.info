# @playitforward/ngx-gtag <img style="margin-bottom: -6px" width="30" src="../../libs/agx-assets/src/lib/images/tech/playitforward-x250.png">

**A simple gTag module for Angular applications**

[![status-image]][status-link]
[![version-image]][version-link]
[![coverage-image]][coverage-link]
[![download-image]][download-link]

# Overview

## Description

Tracking application page view and events for the purpose of monitoring trends and recalibrating your application is great.
This library helps you achieving just that via Google's Analytics.

**@playitforward/ngx-gtag** attempts to streamline the analytics of your application, while promoting DRY **DRY**.

# How to install

    npm i @playitforward/ngx-gtag |OR| yarn add @playitforward/ngx-gtag

# How to use

```typescript
// In your environment{prod,staging}.ts

import { ApplicationConfig } from '@playitforward/ngx-config';
import { LogLevel } from '@playitforward/ngx-logger';

export const environment: ApplicationConfig = {
  // app name
  appName: '@playitforward/ngx-gtag',
  production: true,

  log: {
    // log level (application-wide)
    level: LogLevel.debug,
  },
  gtag: {
    // ability to disable tracking (ex; dev / staging mode)
    isEnabled: true,
    // google tracking ID for your application domain
    trackingId: 'UA-XXXXXX-Y',
    // track page view on start (on route changes)
    routeChangeTracking: true,
  },
};
```

```typescript
// In your app.module.ts

import { CfgModule } from '@playitforward/ngx-config';
import { LoggerModule } from '@playitforward/ngx-logger';
import { GTagModule } from '@playitforward/ngx-gtag';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CfgModule.forRoot(environment), // make the environment injectable
    LoggerModule,
    GTagModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

```typescript
// In your app.component.ts

import { Component } from '@angular/core';
import {
  ConfigService,
  DefaultApplicationConfig,
} from '@playitforward/ngx-config';
import { LogService } from '@playitforward/ngx-logger';
import { GTagService } from '@playitforward/ngx-gtag';

@Component({
  selector: 'playitforward-root',
  template: `<h1>Welcome to {{ title }}!</h1>`,
})
export class AppComponent {
  title = 'PlayItForward';
  constructor(
    readonly config: ConfigService,
    readonly logger: LogService,
    readonly tagger: GTagService
  ) {
    this.title = this.config.options.appName;
    this.logger.info('AppComponent loaded ...');
    // all route changes are tracked automatically from now on
    this.trackDetailedEvent();
    this.trackEvent();
  }

  trackDetailedEvent() {
    // example of event with params
    tagger.trackEvent('home-page', {
      event_category: 'SEO',
      event_label: 'Page loaded, anonymous user',
    });
  }

  trackEvent() {
    // example of event without params
    tagger.trackEvent('home-page-visit');
  }
}
```

# Advanced usage

```typescript
// In your environment{prod,staging}.ts

import { ApplicationConfig, TargetPlatform } from '@playitforward/ngx-config';
import { LogLevel } from '@playitforward/ngx-logger';

export const environment: ApplicationConfig = {
  appName: '@playitforward/ngx-gtag',
  // ...
  gtag: {
    // ability to disable tracking (ex; dev / staging mode)
    isEnabled: true,
    // google tracking ID for domain
    trackingId: 'UA-XXXXXX-Y',
    // track page view on start (on route change)
    routeChangeTracking: false,
  },
};
```

```typescript
// track page view manually with specific options
tagger.trackPageView({
  page_path: '/',
  page_title: 'Home Page',
  page_location: 'https://playitforward.info/'
});

// or with default options
tagger.trackPageView();

// where defaults are:
// page_path = router.url
// page_title = [active-route.data.title] | [environment.appName]
const routes: Routes = [
  { path: '', component: HomeComponent, { title: 'Home page direct' }},
  { path: 'home', component: HomeComponent, data: { title: 'Home page' } }
];
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
[version-image]: https://img.shields.io/npm/v/@playitforward/ngx-gtag.svg
[version-link]: https://www.npmjs.com/package/@playitforward/ngx-gtag
[coverage-image]: https://coveralls.io/repos/neekware/playitforward/badge.svg
[coverage-link]: https://coveralls.io/r/neekware/playitforward
[download-image]: https://img.shields.io/npm/dm/@playitforward/ngx-gtag.svg
[download-link]: https://www.npmjs.com/package/@playitforward/ngx-gtag
