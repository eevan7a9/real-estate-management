import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidatorsDirective } from 'src/app/shared/directives/custom-validators.directive';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public error = false;
  public registerForm: FormGroup;

  constructor(private fb: FormBuilder, private customValidators: CustomValidatorsDirective) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.customValidators.patternValidator(/\d/, { hasNumber: true }),
        this.customValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        this.customValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
        this.customValidators.patternValidator(/[!@#$%^&*(),.?":{}|<>]/, { hasSpecialCharacters: true })
      ]],
      confirm: ['', Validators.required],
      termService: [false, Validators.required]
    }, {
      validators: this.customValidators.isDifferent('password', 'confirm', 'notConfirmed')
    });
  }

  ngOnInit() { }

  public submit() {
    if (this.registerForm.invalid) {
      this.error = true;
      return;
    }
    console.log(this.registerForm.value);
  }
}
