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
  @Input() singleCol = false;
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
            id: '01',
            address: 'Some place free',
            description: 'And this is nice',
            name: 'Property A',
            type: 'house'
          },
          {
            id: '02',
            address: 'Some place free',
            description: 'And this is nice',
            name: 'Property B',
            type: 'apartment'
          },
          {
            id: '03',
            address: 'Some place free',
            description: 'And this is nice',
            name: 'Property C',
            type: 'pad'
          },
          {
            id: '04',
            address: 'Some place free',
            description: 'And this is nice',
            name: 'Property D',
            type: 'pad'
          },
          {
            id: '05',
            address: 'Some place free',
            description: 'And this is nice',
            name: 'Property E',
            type: 'boardingHouse'
          }
        ];
        this.properties = this.propertiesService.properties;
      }
    });
  }

  public selectProperty(property: Property) {
    this.propertiesService.property = property;
    this.router.navigate(['/properties', property.id]);
  }
}
