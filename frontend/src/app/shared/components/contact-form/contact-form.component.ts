import { Component, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ContactSubmissionService } from '../../services/contact-submission/contact-submission.service';
import { ContactSubmissionTopic } from '../../interface/contact-submission';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css'],
  standalone: false
})
export class ContactFormComponent implements OnInit {
  public error = false;
  public contactForm: UntypedFormGroup;
  public isSubmitting = false;
  public submitError = false;
  public readonly topics: { value: ContactSubmissionTopic; label: string }[] = [
    { value: 'general', label: 'General question' },
    { value: 'property', label: 'Property question' },
    { value: 'account', label: 'Account question' },
    { value: 'technical', label: 'Technical issue' },
    { value: 'other', label: 'Other' }
  ];
  public sent = false;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private toastCtrl: ToastController,
    private contactSubmissionService: ContactSubmissionService
  ) {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      topic: ['general', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }
  ngOnInit() {}

  submit() {
    if (this.contactForm.invalid) {
      this.error = true;
      return;
    }

    this.error = false;
    this.submitError = false;
    this.isSubmitting = true;

    this.contactSubmissionService
      .create(this.contactForm.getRawValue())
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.sent = true;
          this.contactForm.reset({ topic: 'general' });
          void this.presentToast('Your message has been sent.');
        },
        error: (response: HttpErrorResponse) => {
          this.isSubmitting = false;
          this.submitError = true;
          void this.presentToast(
            response.error?.message ||
              'Unable to send your message. Please try again.',
            5000,
            'danger'
          );
        }
      });
  }

  private async presentToast(
    message: string,
    duration = 3000,
    color: 'success' | 'danger' = 'success'
  ) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      color
    });
    toast.present();
  }
}
