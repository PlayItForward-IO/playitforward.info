/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiConstants } from '@playitforward/agx-dto';
import { tokenizeFullName, tryGet } from '@playitforward/agx-util';
import { AuthService } from '@playitforward/ngx-auth';
import { ConfigService } from '@playitforward/ngx-config';
import { I18nService, i18nExtractor as _ } from '@playitforward/ngx-i18n';
import {
  ConfirmationDialogService,
  ProgressService,
  ValidationService,
} from '@playitforward/ngx-shared';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'playitforward-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [ConfirmationDialogService],
})
export class SignupComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private destroy$ = new Subject<boolean>();
  title = _('COMMON.SIGNUP');
  subtitle = _('COMMON.ACCOUNT_CREATE');
  icon = 'account-plus-outline';

  constructor(
    readonly formBuilder: FormBuilder,
    readonly config: ConfigService,
    readonly i18n: I18nService,
    readonly validation: ValidationService,
    readonly auth: AuthService,
    readonly progress: ProgressService,
    readonly confirm: ConfirmationDialogService
  ) {
    this.auth.msg.reset();
  }

  ngOnInit() {
    if (this.auth.state.isLoggedIn) {
      const redirectUrl = tryGet(() => this.config.options.localConfig.signupLandingPageUrl, '/');
      this.auth.goTo(redirectUrl);
    } else {
      this.buildForm();
      this.form.valueChanges
        .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
        .subscribe(() => this.auth.msg.reset());
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(ApiConstants.NAME_MIN_LENGTH),
            this.validation.validateFullName,
          ],
        ],
        email: [
          '',
          [Validators.required, this.validation.validateEmail],
          [this.auth.validateEmailAvailability()],
        ],
        password: ['', [Validators.required, this.validation.validatePassword]],
        passwordConfirmation: ['', [Validators.required]],
      },
      { validators: this.validation.matchingPasswords }
    );
  }

  submit() {
    const { email, password, name } = this.form.value;
    const { firstName, lastName } = tokenizeFullName(name);
    const language = this.i18n.currentLanguage;

    this.auth
      .signupRequest$({
        email,
        firstName,
        lastName,
        password,
        language,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
