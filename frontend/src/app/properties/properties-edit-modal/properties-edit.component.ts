import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { PropertyType } from 'src/app/shared/enums/property';
import { Property } from 'src/app/shared/interface/property';
import { PropertiesCoordinatesComponent } from '../properties-coordinates-modal/properties-coordinates.component';
import { PropertiesService } from '../properties.service';

@Component({
  selector: 'app-properties-edit',
  templateUrl: './properties-edit.component.html',
  styleUrls: ['./properties-edit.component.scss'],
})
export class PropertiesEditComponent implements OnInit {
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
  public property: Property;

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private propertiesService: PropertiesService
  ) {
    this.propertyForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      description: [''],
      type: [PropertyType.residential],

      price: ['',],
      currency: ['', Validators.maxLength(3)],
      features: [''],
      lat: ['0', Validators.required],
      lng: ['0', Validators.required],
    });
  }

  ngOnInit() {
    this.propertiesService.property$.subscribe(property => {
      this.property = property;
      const {
        name, address, description, type, price, currency, features, position
      } = property;

      this.propertyForm.patchValue(
        {
          name,
          address,
          description,
          type,
          price,
          currency,
          features: features ? features.join(', ').trim() : '',
          lat: position.lat,
          lng: position.lng
        }
      );
    });
  }

  public update() {
    if (!this.propertyForm.valid) {
      return;
    }
    const { name, address, description, type, price, currency, features, lat, lng } = this.propertyForm.value;
    const editedProperty: Property = {
      id: this.property.id,
      name,
      address,
      description,
      type,
      price,
      currency,
      features: features.split(',').filter((item: string) => item.trim() !== ''),
      position: { lat, lng }
    };
    const property = { ...this.property, ...editedProperty };
    this.propertiesService.updateProperty(property);
    this.modalCtrl.dismiss();
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
}
