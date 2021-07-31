import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { EnquiryTopic } from 'src/app/shared/enums/enquiry';
@Component({
  selector: 'app-enquiries-new',
  templateUrl: './enquiries-new.component.html',
  styleUrls: ['./enquiries-new.component.scss'],
})
export class EnquiriesNewComponent implements OnInit {
  public enquiryForm: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder
  ) {
    this.enquiryForm = this.formBuilder.group({
      title: ['', Validators.required],
      email: ['', Validators.required],
      content: ['', Validators.required],
      topic: [EnquiryTopic.info, Validators.required],
    });
  }

  ngOnInit() { }

  public submit() {
    if (!this.enquiryForm.valid) {
      return;
    }
    console.log(this.enquiryForm.value);
  }

  public dismissModal() {
    this.modalCtrl.dismiss();
  }
}
