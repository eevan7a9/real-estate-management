import { Directive } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appCustomValidators]'
})
export class CustomValidatorsDirective {

  constructor() { }

  public isSameValidator(v1: string, v2: string, error = 'isSame'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const val1 = control.get(v1);
      const val2 = control.get(v2);
      return val1 && val2 && val1.value === val2.value ? { [error]: true } : null;
    };
  }

  public isGreaterValidator(isGreater: string, isLess: string, error = 'isGreater'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const val1 = Number(control.value[isGreater].split(',').join(''));
      const val2 = Number(control.value[isLess].split(',').join(''));
      return val1 && val2 && val1 <= val2 ? { [error]: true } : null;
    };
  }

  public isAbove(num: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      if (isNaN(value)) {
        return;
      }
      return value > num ? { isAbove: true } : null;
    };
  }
}
