/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActionStatus } from '@fullerstack/agx-dto';
import { AuthService } from '@fullerstack/ngx-auth';
import { ConfigService } from '@fullerstack/ngx-config';
import { GqlErrorsHandler } from '@fullerstack/ngx-gql';
import { UserSelfUpdateInput } from '@fullerstack/ngx-gql/schema';
import { i18nExtractor as _ } from '@fullerstack/ngx-i18n';
import { LoggerService } from '@fullerstack/ngx-logger';
import { ConfirmationDialogService } from '@fullerstack/ngx-shared';
import { UserService } from '@fullerstack/ngx-user';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'fullerstack-user-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss'],
  providers: [ConfirmationDialogService],
})
export class ProfileUpdateComponent implements OnDestroy {
  form: FormGroup;
  destroy$ = new Subject<boolean>();
  title = _('COMMON.PROFILE');
  subtitle = _('COMMON.PROFILE_UPDATE');
  icon = 'account-edit-outline';
  actionStatus: ActionStatus;
  actionMessage: string;

  constructor(
    readonly config: ConfigService,
    readonly logger: LoggerService,
    readonly auth: AuthService,
    readonly user: UserService,
    readonly confirm: ConfirmationDialogService
  ) {}

  update(data: UserSelfUpdateInput) {
    this.user
      .userSelfUpdateMutate(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          if (user) {
            this.actionStatus = ActionStatus.success;
          }
        },
        error: (errors: GqlErrorsHandler) => {
          this.logger.error(errors);
          this.actionStatus = ActionStatus.failure;
        },
      });
  }

  formSet(form: FormGroup) {
    this.form = form;
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.form?.dirty && this.auth.state.isLoggedIn) {
      const title = _('COMMON.LEAVE_PAGE');
      const info = _('WARN.DISCARD_CHANGES_ACTION');
      return this.confirm.confirmation(title, info);
    }
    return true;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
