import { InjectionToken } from '@angular/core';

export const defaultErrors = {
  required: (error: any) => `This field is required`,
  minlength: ({
    requiredLength,
    actualLength,
  }: {
    requiredLength: any;
    actualLength: any;
  }): string => `Expect ${requiredLength} but got ${actualLength}`,
};

export const FORM_ERRORS = new InjectionToken('FORM_ERRORS', {
  providedIn: 'root',
  factory: () => defaultErrors,
});
