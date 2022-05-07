import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { EnquiryTopic } from 'src/app/shared/enums/enquiry';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-enquiries-new-form',
  templateUrl: './enquiries-new-form.component.html',
  styleUrls: ['./enquiries-new-form.component.scss'],
})
export class EnquiriesNewFormComponent implements OnInit {
  public error = false;
  public enquiryForm: FormGroup;
  public Editor = ClassicEditor;

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

  public async submit() {
    if (!this.enquiryForm.valid) {
      this.error = true;
      return;
    }
    console.log(this.enquiryForm.value);

    const hasModal = await this.modalCtrl.getTop();
    if (hasModal) {
      this.modalCtrl.dismiss();
    }
    this.presentToast('Success, message is sent.');
  }

  public onReady(e) {
    console.log(e);
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
