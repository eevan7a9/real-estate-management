import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PropertiesService } from 'src/app/properties/properties.service';
import { Property } from 'src/app/shared/interface/property';


@Component({
  selector: 'app-properties-card',
  templateUrl: './properties-card.component.html',
  styleUrls: ['./properties-card.component.scss'],
})
export class PropertiesCardComponent implements OnInit {

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
