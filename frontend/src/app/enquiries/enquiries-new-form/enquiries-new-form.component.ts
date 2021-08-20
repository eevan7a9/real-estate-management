import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { EnquiryTopic } from 'src/app/shared/enums/enquiry';

@Component({
  selector: 'app-enquiries-new-form',
  templateUrl: './enquiries-new-form.component.html',
  styleUrls: ['./enquiries-new-form.component.scss'],
})
export class EnquiriesNewFormComponent implements OnInit {
  public error = false;
  public enquiryForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
  ) {
    this.enquiryForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      content: ['', [Validators.required, Validators.minLength(8)]],
      topic: [EnquiryTopic.info, Validators.required],
    });
  }

  ngOnInit() { }

  public submit() {
    if (!this.enquiryForm.valid) {
      this.error = true;
      return;
    }
    console.log(this.enquiryForm.value);
    this.presentToast('Success, message is sent.');
    this.modalCtrl.dismiss();
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
