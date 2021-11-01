import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PropertiesService } from 'src/app/properties/properties.service';
import { Property } from '../../interface/property';

@Component({
  selector: 'app-property-card',
  templateUrl: './property-card.component.html',
  styleUrls: ['./property-card.component.scss'],
})
export class PropertyCardComponent implements OnInit {

  @Input() property: Property;
  constructor(
    private propertiesService: PropertiesService,
    private router: Router
  ) { }

  ngOnInit() { }

  public selectProperty(property: Property) {
    this.propertiesService.property = property;
    this.router.navigate(['/properties', property.property_id]);
  }

}
