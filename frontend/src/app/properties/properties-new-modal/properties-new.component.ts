import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { PropertyType } from 'src/app/shared/enums/property';
import { PropertiesService } from '../properties.service';

@Component({
  selector: 'app-properties-new',
  templateUrl: './properties-new.component.html',
  styleUrls: ['./properties-new.component.scss'],
})
export class PropertiesNewComponent implements OnInit {
  public propertyForm: FormGroup;
  public propertyTypes = [
    {
      label: 'House',
      value: PropertyType.house
    },
    {
      label: 'Apartment',
      value: PropertyType.apartment
    },
    {
      label: 'Pad',
      value: PropertyType.pad
    }, {
      label: 'Boarding house',
      value: PropertyType.boardingHouse
    }
  ];

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private propertiesService: PropertiesService
  ) {
    this.propertyForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      description: [''],
      type: [PropertyType.house],
    });
  }

  ngOnInit() { }

  public submit() {
    if (!this.propertyForm.valid) {
      return;
    }
    console.log(this.propertyForm.value);
    this.propertiesService.addProperty(this.propertyForm.value);
  }

  public dismissModal() {
    this.modalCtrl.dismiss();
  }
}
