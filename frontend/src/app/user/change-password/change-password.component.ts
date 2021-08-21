import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidatorsDirective } from 'src/app/shared/directives/custom-validators.directive';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  public error = false;
  public changePassForm: FormGroup;

  constructor(private fb: FormBuilder, private customValidators: CustomValidatorsDirective) {
    this.changePassForm = this.fb.group({
      passwordCurrent: ['', Validators.required],
      passwordNew: ['', [
        Validators.required,
        Validators.minLength(8),
        this.customValidators.patternValidator(/\d/, { hasNumber: true }),
        this.customValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        this.customValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
        this.customValidators.patternValidator(/[!@#$%^&*(),.?":{}|<>]/, { hasSpecialCharacters: true })
      ]],
      passwordConfirm: ['', [
        Validators.required,
        Validators.minLength(8),
        this.customValidators.patternValidator(/\d/, { hasNumber: true }),
        this.customValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        this.customValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
        this.customValidators.patternValidator(/[!@#$%^&*(),.?":{}|<>]/, { hasSpecialCharacters: true })
      ]],
    });
  }

  ngOnInit() { }

  public submit() {
    if (this.changePassForm.invalid) {
      this.error = true;
      return;
    }
    console.log(this.changePassForm.value);
  }
}
