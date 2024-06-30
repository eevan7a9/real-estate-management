import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static isSame(
    field1: string,
    field2: string,
    errorName: string = 'isSame'
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const field1Control = control.get(field1);
      const field2Control = control.get(field2);

      if (!field1Control || !field2Control) {
        return null;
      }

      return field1Control.value === field2Control.value
        ? { [errorName]: true }
        : null;
    };
  }

  static isDifferent(
    v1: string,
    v2: string,
    errorName = 'isDifferent'
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const val1 = control.get(v1);
      const val2 = control.get(v2);
      return val1 && val2 && val1.value !== val2.value
        ? { [errorName]: true }
        : null;
    };
  }

  static isGreaterValidator(
    a: string,
    b: string,
    errorName = 'isGreater'
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const val1 = Number(control.value[a].split(',').join(''));
      const val2 = Number(control.value[b].split(',').join(''));
      return val1 && val2 && val1 <= val2 ? { [errorName]: true } : null;
    };
  }

  static isAbove(num: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      if (isNaN(value)) {
        return;
      }
      return value > num ? { isAbove: true } : null;
    };
  }

  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }
      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);
      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }

  static emailValidation(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const email: string = control.value;
      if (!email) {
        // If the email is not provided, don't perform validation
        return null;
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        // If the email format is invalid, return an error
        return { invalidFormat: true };
      }
      // Email is valid
      return null;
    };
  }

  static confirmPasswordValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    if (!control.parent) {
      return null;
    }
    const passwordNew = control.parent.get('passwordNew').value;
    const passwordConfirm = control.value;
    return passwordNew === passwordConfirm ? null : { PasswordNoMatch: true };
  };
}
