/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { LoggerService } from '@playitforward/ngx-logger';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthAuthenticatedGuard implements CanActivate, CanActivateChild, CanLoad {
  private nameSpace = 'AUTH';
  constructor(readonly logger: LoggerService, readonly auth: AuthService) {
    this.logger.info(`[${this.nameSpace}] AuthAuthenticatedGuard loaded ...`);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.handleRequest(state.url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.handleRequest(state.url);
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.auth.state.isLoggedIn) {
      return true;
    }
    this.auth.goTo(this.auth.authUrls.loginUrl);
  }

  private handleRequest(url?: string): boolean {
    if (this.auth.state.isLoggedIn) return true;
    this.auth.nextUrl = url;
    this.auth.goTo(this.auth.authUrls.loginUrl);
    return false;
  }
}
