import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Property } from 'src/app/shared/interface/property';
import { PropertiesService } from '../properties.service';

@Component({
  selector: 'app-properties-list',
  templateUrl: './properties-list.component.html',
  styleUrls: ['./properties-list.component.scss'],
})
export class PropertiesListComponent implements OnInit {
  public properties: Property[];

  constructor(
    private propertiesService: PropertiesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.propertiesService.properties$.subscribe(v => {
      this.properties = v;
      if (!this.properties.length) {
        this.propertiesService.properties = [
          {
            address: 'Some place free',
            description: 'And this is nice',
            name: 'Property A',
            propId: '01',
            type: 'house'
          },
          {
            address: 'Some place free',
            description: 'And this is nice',
            name: 'Property B',
            propId: '02',
            type: 'apartment'
          },
          {
            address: 'Some place free',
            description: 'And this is nice',
            name: 'Property C',
            propId: '03',
            type: 'pad'
          },
          {
            address: 'Some place free',
            description: 'And this is nice',
            name: 'Property D',
            propId: '04',
            type: 'pad'
          },
          {
            address: 'Some place free',
            description: 'And this is nice',
            name: 'Property E',
            propId: '05',
            type: 'boardingHouse'
          }
        ];
        this.properties = this.propertiesService.properties;
      }
    });
  }

  public selectProperty(property: Property) {
    this.propertiesService.property = property;
    this.router.navigate(['/properties', property.propId]);
  }
}
