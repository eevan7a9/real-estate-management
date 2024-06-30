import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  /**
   * Validator function to check if the values of two form controls are the same.
   * @param a name/key of the 1st control.
   * @param b name/key of the 2nd control.
   * @param errorName The name of the error to return if validation fails.
   * @returns returns a validation error object if the condition fails, otherwise null.
   */
  static isSame(
    a: string,
    b: string,
    errorName: string = 'isSame'
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const aControl = control.get(a);
      const bControl = control.get(b);

      if (!aControl || !bControl) {
        return null;
      }

      return aControl.value === bControl.value
        ? { [errorName]: true }
        : null;
    };
  }

  /**
   * Validator function to check if the values of two form controls are different.
   * @param a name/key of the 1st control.
   * @param b name/key of the 2nd control.
   * @param errorName The name of the error to return if validation fails.
   * @returns returns a validation error object if the condition fails, otherwise null.
   */
  static isDifferent(
    a: string,
    b: string,
    errorName = 'isDifferent'
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const val1 = control.get(a);
      const val2 = control.get(b);
      return val1 && val2 && val1.value !== val2.value
        ? { [errorName]: true }
        : null;
    };
  }

  /**
   * Validator function to check if one control's value is greater than another control's value.
   * @param a name/key of the 1st control.
   * @param b name/key of the 2nd control.
   * @param errorName The name of the error to return if validation fails.
   * @returns returns a validation error object if the condition fails, otherwise null.
   */
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

  /**
   * Validator function to validate value against a regular expression pattern.
   * @param regex The regular expression pattern to test against.
   * @param error error to return if the pattern does not match.
   * @returns returns a validation error object if the pattern does not match, otherwise null.
   */
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

  /**
   * Validator function to validate if a control's value is a valid email address.
   * @returns returns error object if the value is not a valid email address, otherwise null.
   */
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

  /**
   * 
   * @param validate if a password confirmation matches the new password. 
   * @returns returns error object if the value is not a valid email address, otherwise null.
   */
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
