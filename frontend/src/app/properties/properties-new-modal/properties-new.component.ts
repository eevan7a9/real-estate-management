import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { PropertyType } from 'src/app/shared/enums/property';

@Component({
  selector: 'app-properties-new',
  templateUrl: './properties-new.component.html',
  styleUrls: ['./properties-new.component.scss'],
})
export class PropertiesNewComponent implements OnInit {
  public property: FormGroup;
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
    private formBuilder: FormBuilder
  ) {
    this.property = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      description: [''],
      type: [PropertyType.house],
    });
  }

  ngOnInit() { }

  public submit() {
    console.log(this.property.value);
  }

  public dismissModal() {
    this.modalCtrl.dismiss();
  }
}
