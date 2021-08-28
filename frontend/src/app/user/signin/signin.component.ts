import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { UserService } from '../user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  public error = false;
  public authFailed = false;
  public signinForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private user: UserService,
    private toastCtrl: ToastController,
    public loadingController: LoadingController,
    private router: Router
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  public async submit() {
    if (this.signinForm.invalid) {
      this.error = true;
      return;
    }
    const loading = await this.presentLoading();
    loading.present();
    const { email, password } = this.signinForm.value;
    const errMssg = 'Something went wrong, try again later.';
    try {
      const result = await this.user.signIn(email, password);
      await loading.dismiss();
      if (result.error) {
        await this.showToast(result.error.message || errMssg, 'danger');
        return;
      }
      await this.showToast('Success, You are logged in');
      this.router.navigateByUrl('/map');
    } catch (error) {
      await loading.dismiss();
      await this.showToast(errMssg, 'danger');
    }
  }

  private async presentLoading() {
    return await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
  }

  private async showToast(message, color = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }
}
