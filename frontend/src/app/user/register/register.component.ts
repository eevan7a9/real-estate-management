import { Component } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { UserService } from '../user.service';
import { CustomValidators } from 'src/app/shared/validators/custom.validator';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { errorHandler } from '@app/shared/utility/requests';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false
})
export class RegisterComponent {
  public error = false;
  public registerForm: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private toastCtrl: ToastController,
    private loadingController: LoadingController,
    private router: Router,
    private user: UserService
  ) {
    this.registerForm = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(4)]],
        email: ['', [Validators.required, CustomValidators.emailValidation()]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            CustomValidators.patternValidator(/\d/, { hasNumber: true }),
            CustomValidators.patternValidator(/[A-Z]/, {
              hasCapitalCase: true
            }),
            CustomValidators.patternValidator(/[a-z]/, {
              hasSmallCase: true
            }),
            CustomValidators.patternValidator(/[!@#$%^&*(),.?":{}|<>]/, {
              hasSpecialCharacters: true
            })
          ]
        ],
        confirm: ['', Validators.required],
        termService: [false, Validators.required]
      },
      {
        validators: CustomValidators.isDifferent(
          'password',
          'confirm',
          'notConfirmed'
        )
      }
    );
  }

  public async submit() {
    if (this.registerForm.invalid) {
      this.error = true;
      return;
    }
    const loading = await this.presentLoading();
    loading.present();

    const { fullName, email, password } = this.registerForm.value;
    try {
      const result = await firstValueFrom(
        this.user.register(fullName, email, password)
      );
      if (!result.error && result.data) {
        await this.showToast('Success, registration is complete.');
        await this.router.navigateByUrl('/user/account/profile');
      } else {
        await this.showToast(result.message, 'danger');
      }
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse) {
        const { message } = errorHandler(error);
        this.showToast(message, 'danger');
      }
      console.error('Register error:', error);
    } finally {
      loading.dismiss();
    }
  }

  private async presentLoading() {
    return await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...'
    });
  }

  private async showToast(message: string, color = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }
}
