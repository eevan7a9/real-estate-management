import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent implements OnInit {
  public error = false;
  public contactForm: UntypedFormGroup;
  public sent = false;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private toastCtrl: ToastController,
  ) {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }
  ngOnInit() { }

  submit() {
    console.log(this.contactForm.get('email').errors);
    if (this.contactForm.invalid) {
      this.error = true;
      return;
    }
    console.log(this.contactForm.value);
    this.presentToast('Your message have been sent.').then(() => {
      this.error = false;
      this.contactForm.reset();
      this.sent = true;
    });
  }

  private async presentToast(message: string, duration = 3000) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      color: 'success'
    });
    toast.present();
  }
}
