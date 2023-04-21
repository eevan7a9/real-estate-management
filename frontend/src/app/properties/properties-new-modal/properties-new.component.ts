import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Validators, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { PropertyType } from 'src/app/shared/enums/property';
import { PropertiesService } from '../properties.service';
import { PropertiesCoordinatesComponent } from '../properties-coordinates-modal/properties-coordinates.component';

@Component({
  selector: 'app-properties-new',
  templateUrl: './properties-new.component.html',
  styleUrls: ['./properties-new.component.scss'],
})
export class PropertiesNewComponent implements OnInit {
  public propertyForm: UntypedFormGroup;
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
  public error = false;
  public isSubmit = false;

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: UntypedFormBuilder,
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
      currency: ['PHP', [Validators.maxLength(3), Validators.pattern('^[a-zA-Z ]*$')]],
      features: [''],
      lat: ['0', Validators.required],
      lng: ['0', Validators.required],
    });
  }

  ngOnInit() { }

  public async submit() {
    if (this.step === 1 && this.validateStepOne()) {
      this.step = 2;
      return;
    }
    if (this.step === 2 && this.validateStepTwo()) {
      this.isSubmit = true;
      const ft = this.propertyForm.get('features').value;

      this.propertyForm.patchValue({
        features: ft.split(',').filter((item: string) => item.trim() !== '')
      });
      const { lat, lng } = this.propertyForm.value;
      const newProperty = { ...this.propertyForm.value, ...{ position: { lat, lng }, date: new Date() } };
      const { data, message } = await this.propertiesService.addProperty(newProperty);
      if (data) {
        this.modalCtrl.dismiss(data);
        this.presentToast(message);
        return;
      }
      this.presentToast('Error:' + message, 'danger');
      return;
    }
    this.presentToast('Error: Invalid, please fill the form properly', 'danger');
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
    this.error = true;
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
    this.error = true;
  }

  private async presentToast(message: string, color = 'success', duration = 3000) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      color
    });
    toast.present();
  }
}
