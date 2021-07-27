/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Direction } from '@angular/cdk/bidi';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { tryGet } from '@fullerstack/agx-util';
import { I18nService } from '@fullerstack/ngx-i18n';

import { BehaviorSubject, Subject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, first, takeUntil } from 'rxjs/operators';

import { HINT_DEBOUNCE_TIME } from './hint.model';
import { validatorHintMessage } from './hint.util';

@Component({
  selector: 'fullerstack-hint',
  templateUrl: './hint.component.html',
  styleUrls: ['./hint.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HintComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() control: AbstractControl;
  @Input() direction: Direction;
  @Input() hint: string;

  private _touched = false;
  @Input()
  set isTouched(value: boolean) {
    this._touched = value;
    this.process();
  }

  private destroy$ = new Subject<boolean>();
  hasError$ = new BehaviorSubject<boolean>(false);
  hasHint$ = new BehaviorSubject<boolean>(false);
  error: string = undefined;
  ltrDirection = true;

  constructor(readonly i18n: I18nService) {
    this.setHintOrError(!!this.error, !!this.hint);
  }

  reset(): void {
    this.error = undefined;
  }

  ngOnInit() {
    if (this.direction) {
      this.ltrDirection = this.direction === 'ltr';
    } else {
      this.i18n.languageChanges$.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.ltrDirection = this.i18n.direction === 'ltr';
        },
      });
    }
  }

  ngOnChanges() {
    if (this.direction) {
      this.ltrDirection = this.direction === 'ltr';
    } else {
      this.ltrDirection = this.i18n.direction === 'ltr';
    }
  }

  ngAfterViewInit() {
    merge(this.control.valueChanges, this.control.statusChanges)
      .pipe(debounceTime(HINT_DEBOUNCE_TIME), takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.process();
        },
      });
  }

  private setHintOrError(error: boolean, hint: boolean) {
    if (error) {
      this.hasError$.next(error);
      this.hasHint$.next(false);
    } else if (hint) {
      this.hasHint$.next(hint);
      this.hasError$.next(false);
    }
  }

  process() {
    for (const error in this.control.errors) {
      const hasError = Object.prototype.hasOwnProperty.call(this.control.errors, error);
      if ((hasError && this._touched) || !this.control.pristine) {
        this.processFeedback(error, this.control.errors[error]);
        this.setHintOrError(!!this.error, !!this.hint);
        return;
      }
    }
    this.setHintOrError(false, !!this.hint);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private processFeedback(validatorName: string, validatorValue?: any) {
    validatorName = validatorName === 'pattern' ? 'invalidFormat' : validatorName;

    if (validatorName === 'minlength') {
      return this.handleMinimumLength(validatorValue.requiredLength);
    }

    if (validatorName === 'maxlength') {
      return this.handleMaximumLength(validatorValue.requiredLength);
    }

    this.error = tryGet(
      () => validatorHintMessage(validatorName),
      validatorHintMessage('invalidInput')
    );
  }

  private handleMinimumLength(requiredLength: number) {
    const message = validatorHintMessage('minlength');
    this.i18n.translate
      .get(message, { __value__: requiredLength })
      .pipe(first(), takeUntil(this.destroy$))
      .subscribe((error: string) => {
        this.error = error;
      });
  }

  private handleMaximumLength(requiredLength: number) {
    const message = validatorHintMessage('maxlength');
    this.i18n.translate
      .get(message, { __value__: requiredLength })
      .pipe(first(), takeUntil(this.destroy$))
      .subscribe((error: string) => {
        this.error = error;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
