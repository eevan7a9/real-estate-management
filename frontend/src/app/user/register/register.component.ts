import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { CustomValidatorsDirective } from 'src/app/shared/directives/custom-validators.directive';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public error = false;
  public registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private customValidators: CustomValidatorsDirective,
    private toastCtrl: ToastController,
    private loadingController: LoadingController,
    private router: Router,
    private user: UserService
  ) {
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

  public async submit() {
    if (this.registerForm.invalid) {
      this.error = true;
      return;
    }
    const loading = await this.presentLoading();
    loading.present();
    setTimeout(async () => {
      const { fullName, email, password } = this.registerForm.value;
      const result = await this.user.register(fullName, email, password);
      if (!result.error) {
        loading.dismiss();
        await this.showToast('Success, registration is complete.');
        await this.router.navigateByUrl('/user/account/profile');
      }
    }, 1000);
  }


  private async presentLoading() {
    return await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
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
