import { Component, Input } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { IonInput, ModalController, ToastController } from '@ionic/angular';
import { EnquiryTopic } from 'src/app/shared/enums/enquiry';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Property } from 'src/app/shared/interface/property';
import { EnquiriesService } from '../enquiries.service';
import { UserService } from 'src/app/user/user.service';
import { NeedSigninContinueComponent } from 'src/app/shared/components/need-signin-continue/need-signin-continue.component';
import { RestrictionService } from 'src/app/shared/services/restriction/restriction.service';

@Component({
    selector: 'app-enquiries-new-form',
    templateUrl: './enquiries-new-form.component.html',
    styleUrls: ['./enquiries-new-form.component.css'],
    standalone: false
})
export class EnquiriesNewFormComponent {
  @Input() property: Partial<Property>;
  @Input() userTo: string;
  @Input() replyTo?: {
    enquiry_id: string;
    title: string;
    topic: string;
  };

  public error = false;
  public submitting = false;
  public enquiryForm: UntypedFormGroup;
  public Editor = ClassicEditor;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private enquiriesService: EnquiriesService,
    private userService: UserService,
    private restriction: RestrictionService
  ) {
    this.enquiryForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      content: ['', [Validators.required, Validators.minLength(8)]],
      topic: [EnquiryTopic.info, Validators.required],
    });
  }

  public async submit() {
    this.enquiryForm.markAllAsTouched();

    if (!this.enquiryForm.valid) {
      this.error = true;
      return;
    }
    this.submitting = true;

    if(this.restriction.restricted) {
      this.modalCtrl.dismiss();
      return this.restriction.showAlert();
    }

    if (!this.userService.user) {
      const modalNeedSignin = await this.modalCtrl.create({
        component: NeedSigninContinueComponent,
        componentProps: { isModal: true },
      });
      return modalNeedSignin.present();
    }

    if (!this.enquiriesService.enquiries.length) {
      this.enquiriesService.fetchEnquiries();
    }

    const enquiryForm = {
      userTo: this.userTo,
      ...this.enquiryForm.value,
      ...(this.replyTo ? { replyTo: this.replyTo } : ''),
    };

    const res = await this.enquiriesService.createEnquiry(
      enquiryForm,
      this.property
    );

    if (!res || res.status !== 201) {
      const msg = 'Error: Something went wrong, please try again later.';
      this.presentToast(`Error: ${res.message || msg}`, 3000, 'danger');
      return;
    }
    //checks if component is in modal
    const hasModal = await this.modalCtrl.getTop();
    if (hasModal) {
      this.modalCtrl.dismiss();
    }
    this.enquiryForm.reset();
    this.presentToast('Success, message is sent.');
  }

  private async presentToast(
    message: string,
    duration = 3000,
    color = 'success'
  ) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      color,
    });
    toast.present();
  }
}
