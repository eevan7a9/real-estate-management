import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { ToastController } from '@ionic/angular';
import { CustomValidators } from 'src/app/shared/validators/custom.validator';
import { RestrictionService } from 'src/app/shared/services/restriction/restriction.service';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { errorHandler } from '@app/shared/utility/requests';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  standalone: false
})
export class ChangePasswordComponent implements OnInit {
  public error = false;
  public changePassForm: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private user: UserService,
    private toast: ToastController,
    private restriction: RestrictionService,
  ) {

    const passwordValidators = [
      Validators.required,
      Validators.minLength(8),
      CustomValidators.patternValidator(/\d/, { hasNumber: true }),
      CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
      CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
      CustomValidators.patternValidator(/[!@#$%^&*(),.?":{}|<>]/, { hasSpecialCharacters: true })
    ];

    this.changePassForm = this.fb.group({
      passwordCurrent: ['', Validators.required],
      passwordNew: ['', passwordValidators],
      passwordConfirm: ['', [...passwordValidators, CustomValidators.confirmPasswordValidator]]
    });
  }

  ngOnInit() { }

  public async submit(): Promise<void> {
    if (this.changePassForm.invalid) {
      this.error = true;

      let message = 'Form is not valid';
      if (this.changePassForm.controls.passwordConfirm?.errors?.PasswordNoMatch) message = 'Passwords are not matching'

      const toast = await this.toast.create({
        message,
        duration: 5000,
        color: 'danger'
      });
      return toast.present();
    }
    if (this.restriction.restricted) {
      return this.restriction.showAlert();
    }

    const passwordCurrent = this.changePassForm.value.passwordCurrent;
    const passwordNew = this.changePassForm.value.passwordNew;
    try {
      const res = await firstValueFrom(this.user.changePassword(passwordNew, passwordCurrent));
      this.changePassForm.reset();
      console.log('Change Password response:', res);

      if (res.status === 200) {
        this.user.signOut();
      }
      this.toast.create({
        message: res.message,
        duration: 5000,
        color: res.status === 200 ? 'success' : 'danger'
      }).then(toast => toast.present());
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse) {
        const response = errorHandler(error);
        this.toast.create({
          message: response.message,
          duration: 5000,
          color: 'danger'
        }).then(toast => toast.present());
      }
      console.error('Change Password error:', error);
    }
  }
}
