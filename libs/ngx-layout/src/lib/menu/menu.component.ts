/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@fullerstack/ngx-auth';
import { MenuItem, MenuNode } from '@fullerstack/ngx-menu';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LayoutService } from '../layout.service';
import { layoutMenuTree } from './menu.default';

@Component({
  selector: 'fullerstack-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  rootNode: MenuNode;

  constructor(readonly layout: LayoutService, readonly auth: AuthService) {}

  ngOnInit() {
    this.layout.menu.setPermissionVerificationFunction(this.hasPermission.bind(this));

    this.rootNode = this.layout.menu.buildMenuTree(layoutMenuTree);

    this.auth.authChanged$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        const forceMenuRebuild = true;
        this.rootNode = this.layout.menu.buildMenuTree(layoutMenuTree, forceMenuRebuild);
      },
    });
  }

  redirectUrl(node: MenuNode) {
    if (node.isLink) {
      if (node.isFullSpan && this.layout.state.menuOpen) {
        this.layout.toggleMenu();
      }
      this.auth.goTo(node.link);
    }
  }

  hasPermission(node: MenuItem) {
    const menuPerms = node.permissions || [];
    if (menuPerms.length === 0) {
      return true;
    }

    const userPerms = []; // tryGet<string>(() => this.auth.state.userProfile.permissions, []);
    if (menuPerms.length === 0) {
      return false;
    }

    const hasPerm = menuPerms.some((value) => userPerms.indexOf(value) >= 0);
    return hasPerm;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
