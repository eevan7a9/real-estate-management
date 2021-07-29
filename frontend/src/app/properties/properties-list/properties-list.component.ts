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
    });
    this.propertiesService.properties = [
      {
        name: 'Property A',
        address: 'Some place free',
        description: 'And this is nice',
        type: 'house'
      },
      {
        name: 'Property B',
        address: 'Some place free',
        description: 'And this is nice',
        type: 'apartment'
      },
      {
        name: 'Property C',
        address: 'Some place free',
        description: 'And this is nice',
        type: 'pad'
      },
      {
        name: 'Property D',
        address: 'Some place free',
        description: 'And this is nice',
        type: 'pad'
      },
      {
        name: 'Property E',
        address: 'Some place free',
        description: 'And this is nice',
        type: 'boardingHouse'
      }
    ];
    this.properties = this.propertiesService.properties;
  }

  public selectProperty(property: Property) {
    this.propertiesService.property = property;
    this.router.navigate(['/properties', 'id']);
  }
}
