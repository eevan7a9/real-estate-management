import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  return control.parent?.value.passwordNew === control.value
    ? null
    : { PasswordNoMatch: true };
};
