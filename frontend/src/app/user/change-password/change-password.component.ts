import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { CustomValidatorsDirective } from 'src/app/shared/directives/custom-validators.directive';
import { UserService } from '../user.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  public error = false;
  public changePassForm: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private customValidators: CustomValidatorsDirective,
    private user: UserService,
    private toast: ToastController,
    private router: Router
  ) {
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

  public async submit(): Promise<void> {
    if (this.changePassForm.invalid) {
      this.error = true;
      return;
    }
    const passwordCurrent = this.changePassForm.value.passwordCurrent;
    const passwordNew = this.changePassForm.value.passwordNew;
    const res = await this.user.changePassword(passwordNew, passwordCurrent);
    this.changePassForm.reset();

    const toast = await this.toast.create({
      message: res.message,
      duration: 5000,
      color: res.status === 200 ? 'success' : 'danger'
    });
    toast.present();

    if(res.status === 200) {
      this.user.signOut();
      this.router.navigate(['/user/signin'])
    }
  }
}
