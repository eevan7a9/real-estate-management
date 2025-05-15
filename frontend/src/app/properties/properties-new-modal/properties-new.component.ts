import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Validators, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { PaymentFrequency, PropertyType, TransactionType } from 'src/app/shared/enums/property';
import { PropertiesService } from '../properties.service';
import { PropertiesCoordinatesComponent } from '../properties-coordinates-modal/properties-coordinates.component';
import { Property } from 'src/app/shared/interface/property';
import { RestrictionService } from 'src/app/shared/services/restriction/restriction.service';

@Component({
  selector: 'app-properties-new',
  templateUrl: './properties-new.component.html',
  styleUrls: ['./properties-new.component.css'],
  standalone: false
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
  public transactionType = [
    {
      label: 'For Sale',
      value: TransactionType.forSale
    },
    {
      label: 'For Rent',
      value: TransactionType.forRent
    }
  ];
  public rentPaymentFrequency = [
    {
      label: 'Yearly',
      value: PaymentFrequency.yearly
    },
    {
      label: 'Quarterly',
      value: PaymentFrequency.quarterly
    },
    {
      label: 'Monthly',
      value: PaymentFrequency.monthly
    },
    {
      label: 'Bi-Weekly',
      value: PaymentFrequency.biWeekly
    },
    {
      label: 'Weekly',
      value: PaymentFrequency.weekly
    },
    {
      label: 'Daily',
      value: PaymentFrequency.daily
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
    private restriction: RestrictionService
  ) {
    this.propertyForm = this.formBuilder.group({
      // Step 1
      name: ['', [Validators.required, Validators.minLength(4)]],
      address: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      type: [PropertyType.residential],
      transactionType: [TransactionType.forSale],
      // Step 2
      price: ['',],
      paymentFrequency: [PaymentFrequency.monthly],
      currency: ['PHP', [Validators.maxLength(3), Validators.pattern('^[a-zA-Z ]*$')]],
      features: [''],
      lat: ['0', Validators.required],
      lng: ['0', Validators.required],
    });
  }

  ngOnInit() { }

  public async submit(): Promise<void> {
    if (this.step === 1 && this.validateStepOne()) {
      this.step = 2;
      return;
    } else if (this.step === 2 && this.validateStepTwo()) {
      this.isSubmit = true;
      const ft = this.propertyForm.get('features').value;

      this.propertyForm.patchValue({
        features: ft.split(',').filter((item: string) => item.trim() !== '')
      });
      const { lat, lng } = this.propertyForm.value;
      const newProperty = { ...this.propertyForm.value, ...{ position: { lat, lng }, date: new Date() } };

      if (this.restriction.restricted) {
        this.modalCtrl.dismiss();
        return this.restriction.showAlert();
      }
      await this.addProperty(newProperty);
    } else {
      this.presentToast('Error: Invalid, please fill the form properly', 'danger');
    }
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

  private async addProperty(property: Property): Promise<void> {
    const res = await this.propertiesService.addProperty(property);
    if (res.status === 200 || res.status === 201) {
      this.modalCtrl.dismiss(res.data);
      this.propertiesService.addPropertyToState(res.data);
    }
    this.presentToast(res.message, res.status !== 201 ? 'danger' : 'success');
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
