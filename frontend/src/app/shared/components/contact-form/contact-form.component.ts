import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { ContactFormService } from './contact-form.service';

@Component({
    selector: 'app-contact-form',
    templateUrl: './contact-form.component.html',
    styleUrls: ['./contact-form.component.css'],
    standalone: false
})
export class ContactFormComponent implements OnInit {

  public error = false;
  public contactForm: UntypedFormGroup;
  public sent = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private toastCtrl: ToastController,
    private loadingController : LoadingController,
    private contactFormService : ContactFormService
  ) {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }
  ngOnInit() { }

  async submit() {
    if (this.contactForm.invalid) {
      this.error = true;
      return;
    }
    const loading = await this.presentLoading();
    loading.present();

    const data = this.contactForm.value;
    const response = await this.contactFormService.submitContactForm(data);

    loading.dismiss();

    if (response?.data)
    {
      await this.presentToast('Message received successfully!');
      this.error = false;
      this.sent = true;
      this.contactForm.reset();
      return;
    }

    let msg = 'Something went wrong! Try again later.';

    if (typeof response.error === 'string') {
      msg = response.error;
    } else if (response.error?.message) {
      msg = response.error.message;
    } else if (response.message) {
      msg = response.message;
    }
    await this.presentToast(msg, 'danger');

  }

  private async presentToast(message: string, color:string='success') {
    const toast = await this.toastCtrl.create({
      message,
      duration : 3000,
      color: 'success'
    });
    toast.present();
  }
  private async presentLoading() {
    return await this.loadingController.create({
      message: 'Sending...',
    });
  }
}

