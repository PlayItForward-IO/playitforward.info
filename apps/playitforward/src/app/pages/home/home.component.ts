/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@playitforward/ngx-auth';
import { i18nExtractor as _ } from '@playitforward/ngx-i18n';
import { LayoutService } from '@playitforward/ngx-layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'playitforward-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  handSet = false;
  logoSize = 'large';
  pitchList = [
    {
      title: _('PITCH.WHAT.TITLE'),
      description: _('PITCH.WHAT.DESCRIPTION'),
      image: '/assets/images/misc/what.png',
    },
    {
      title: _('PITCH.MISSION.TITLE'),
      description: _('PITCH.MISSION.DESCRIPTION'),
      image: '/assets/images/misc/mission.png',
    },
    {
      title: _('PITCH.HISTORICAL.TITLE'),
      description: _('PITCH.HISTORICAL.DESCRIPTION'),
      image: '/assets/images/misc/trends.png',
    },
    {
      title: _('PITCH.PLATFORMS.TITLE'),
      description: _('PITCH.PLATFORMS.DESCRIPTION'),
      image: '/assets/images/misc/platforms.png',
    },
  ];

  constructor(public auth: AuthService, public layout: LayoutService) {}

  ngOnInit() {
    this.layout.handset$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      if (state.matches) {
        this.handSet = true;
        this.logoSize = 'small';
      } else {
        this.handSet = false;
        this.logoSize = 'large';
      }
    });
  }

  get logo(): string {
    return `/assets/images/logos/logo-${this.logoSize}.png`;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
