import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { PaymentFrequency, PropertyType, TransactionType } from 'src/app/shared/enums/property';
import { Property } from 'src/app/shared/interface/property';
import { PropertiesCoordinatesComponent } from '../properties-coordinates-modal/properties-coordinates.component';
import { PropertiesService } from '../properties.service';
import { RestrictionService } from 'src/app/shared/services/restriction/restriction.service';

@Component({
  selector: 'app-properties-edit',
  templateUrl: './properties-edit.component.html',
  styleUrls: ['./properties-edit.component.css'],
  standalone: false
})
export class PropertiesEditComponent implements OnInit {
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
  @Input() property: Property;

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: UntypedFormBuilder,
    private propertiesService: PropertiesService,
    private toastCtrl: ToastController,
    private restriction: RestrictionService
  ) {
    this.propertyForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      address: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      type: [PropertyType.residential],
      transactionType: [TransactionType.forSale],
      price: ['',],
      paymentFrequency: [PaymentFrequency.monthly],
      currency: ['', Validators.maxLength(3)],
      features: [''],
      lat: ['0', Validators.required],
      lng: ['0', Validators.required],
    });
  }

  ngOnInit() {
    if (this.property) {
      const {
        name, address, description, type, price, paymentFrequency, currency, features, position, transactionType
      } = this.property;

      this.propertyForm.patchValue(
        {
          name,
          address,
          description,
          type,
          price,
          paymentFrequency,
          currency,
          features: features ? features.join(', ').trim() : '',
          transactionType,
          lat: position.lat,
          lng: position.lng
        }
      );
    }
  }

  public async submit(): Promise<void> {
    if (!this.propertyForm.valid) {
      return;
    }
    const {
      name,
      address,
      description,
      type,
      transactionType,
      updatedAt,
      price,
      paymentFrequency,
      currency,
      features,
      lat,
      lng,
    } = this.propertyForm.value;

    const editedProperty: Property = {
      property_id: this.property.property_id,
      name,
      address,
      description,
      type,
      transactionType,
      price,
      paymentFrequency,
      currency,
      updatedAt,
      features: features.split(',').filter((item: string) => item.trim() !== ''),
      position: { lat, lng },
      user_id: this.property.user_id
    };
    const updatedProperty = { ...this.property, ...editedProperty };
    this.updateProperty(updatedProperty);
  }

  public close() {
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

  private async updateProperty(property: Property): Promise<void> {
    if (this.restriction.restricted) {
      this.modalCtrl.dismiss();
      return this.restriction.showAlert();
    }

    const res = await this.propertiesService.updateProperty(property);
    if (res.status === 200 || res.status === 201) {
      const toast = await this.toastCtrl.create({
        message: res.message,
        duration: 3000,
        color: 'success'
      });
      await toast.present();
    }
    this.propertiesService.properties = this.propertiesService.properties.map((property) =>
      property.property_id === res.data.property_id ? res.data : property
    );
    this.modalCtrl.dismiss({ property: res.data });
  }
}
