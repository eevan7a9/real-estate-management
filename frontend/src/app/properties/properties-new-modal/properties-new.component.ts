import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { PropertyType } from 'src/app/shared/enums/property';
import { PropertiesService } from '../properties.service';
import { PropertiesCoordinatesComponent } from '../properties-coordinates-modal/properties-coordinates.component';

@Component({
  selector: 'app-properties-new',
  templateUrl: './properties-new.component.html',
  styleUrls: ['./properties-new.component.scss'],
})
export class PropertiesNewComponent implements OnInit {
  public propertyForm: FormGroup;
  public propertyTypes = [
    {
      label: 'residential',
      value: PropertyType.residential
    },
    {
      label: 'commercial',
      value: PropertyType.commercial
    },
    {
      label: 'industrial',
      value: PropertyType.industrial
    }, {
      label: 'land',
      value: PropertyType.land
    }
  ];
  public step = 1;

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private propertiesService: PropertiesService,
    private toastCtrl: ToastController,
  ) {
    this.propertyForm = this.formBuilder.group({
      id: 'test',
      // Step 1
      name: ['', Validators.required],
      address: ['', Validators.required],
      description: [''],
      type: [PropertyType.residential],
      // Step 2
      price: ['',],
      currency: ['', Validators.maxLength(3)],
      features: [['']],
      lat: ['0', Validators.required],
      lng: ['0', Validators.required],
    });
  }

  ngOnInit() { }

  public submit() {
    if (this.step === 1 && this.validateStepOne()) {
      this.step = 2;
      return;
    }
    if (this.step === 2 && this.validateStepTwo()) {
      this.propertyForm.patchValue({
        features: this.propertyForm.get('features').value
          .split(',').filter((item: string) => item.trim() !== '')
      });
      console.log(this.propertyForm.value);
      this.propertiesService.addProperty(this.propertyForm.value);
      this.modalCtrl.dismiss();
      this.presentToast('Property is Added');
      return;
    }
    console.log('invlid');
  }

  public dismissModal() {
    this.modalCtrl.dismiss();
  }

  public async openMap() {
    const modal = await this.modalCtrl.create({
      component: PropertiesCoordinatesComponent
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      const { lat, lng } = data;
      this.propertyForm.patchValue({ lat, lng });
    }
  }

  private validateStepOne() {
    if (
      this.propertyForm.get('name').valid &&
      this.propertyForm.get('address').valid &&
      this.propertyForm.get('description').valid &&
      this.propertyForm.get('type').valid
    ) {
      return true;
    }
  }

  private validateStepTwo() {
    if (
      this.propertyForm.get('price').valid &&
      this.propertyForm.get('currency').valid &&
      this.propertyForm.get('lat').valid &&
      this.propertyForm.get('lng').valid
    ) {
      return true;
    }
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
