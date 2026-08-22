import { Component, input, Input, signal } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { EnquiryTopic } from 'src/app/shared/enums/enquiry';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Property } from 'src/app/shared/interface/property';
import { EnquiriesService } from '../enquiries.service';
import { UserService } from 'src/app/user/user.service';
import { NeedSigninContinueComponent } from 'src/app/shared/components/need-signin-continue/need-signin-continue.component';
import { RestrictionService } from 'src/app/shared/services/restriction/restriction.service';
import {
  baseRequestResponse,
  errorHandler
} from '@app/shared/utility/requests';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-enquiries-new-form',
  templateUrl: './enquiries-new-form.component.html',
  styleUrls: ['./enquiries-new-form.component.css'],
  standalone: false
})
export class EnquiriesNewFormComponent {
  public property = input<Partial<Property | undefined>>(undefined);
  public userTo = input<string | undefined>(undefined);
  public replyTo = input<
    | {
        enquiry_id: string;
        title: string;
        topic: string;
      }
    | undefined
  >(undefined);

  public error = signal(false);
  public submitting = signal(false);
  public enquiryForm: UntypedFormGroup;
  public Editor = ClassicEditor;

  public editorConfig = {
    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'blockQuote',
      'insertTable',
      '|',
      'undo',
      'redo'
    ]
  };

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
      topic: [EnquiryTopic.info, Validators.required]
    });
  }

  public async submit() {
    this.enquiryForm.markAllAsTouched();
    const property = this.property();

    if (!this.enquiryForm.valid || !property) {
      this.error.set(true);
      return;
    }
    this.submitting.set(true);

    if (this.restriction.restricted) {
      this.modalCtrl.dismiss();
      return this.restriction.showAlert();
    }

    if (!this.userService.user) {
      const modalNeedSignin = await this.modalCtrl.create({
        component: NeedSigninContinueComponent,
        componentProps: { isModal: true }
      });
      return modalNeedSignin.present();
    }

    if (!this.enquiriesService.enquiries.length) {
      this.enquiriesService.fetchEnquiries();
    }

    const enquiryForm = {
      userTo: this.userTo(),
      ...this.enquiryForm.value,
      ...(this.replyTo() ? { replyTo: this.replyTo() } : '')
    };

    console.log('Enquiry form data:', enquiryForm);
    console.log('Property data:', property);

    try {
      const res = await firstValueFrom(
        this.enquiriesService.createEnquiry(enquiryForm, property)
      );
      if (res.data) {
        this.presentToast('Success, message is sent.');
      }
      //checks if component is in modal
      const hasModal = await this.modalCtrl.getTop();
      if (hasModal) {
        this.modalCtrl.dismiss();
      }
      this.enquiryForm.reset();
    } catch (error: unknown) {
      let response = { ...baseRequestResponse };
      if (error instanceof HttpErrorResponse) {
        response = errorHandler(error);
        console.error('fetchEnquiries error:', response.message);
        this.toastCtrl
          .create({
            message: response.message,
            duration: 3000,
            color: 'danger'
          })
          .then((toast) => toast.present());
      }
      console.error('Error Creating Enquiry:', response.message);
    }
  }

  private async presentToast(
    message: string,
    duration = 3000,
    color = 'success'
  ) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      color
    });
    toast.present();
  }
}
