import { Component, Input, OnInit } from '@angular/core';
import { PropertyType } from '../../enums/property';

@Component({
  selector: 'app-property-type-badge',
  templateUrl: './property-type-badge.component.html',
  styleUrls: ['./property-type-badge.component.css'],
  standalone: false
})
export class PropertyTypeBadgeComponent implements OnInit {

  @Input() type = 'residential';
  constructor() { }

  ngOnInit() { }

  typeColor() {
    switch (this.type) {
      case PropertyType.residential:
        return 'danger';
      case PropertyType.commercial:
        return 'tertiary';
      case PropertyType.industrial:
        return 'warning';
      case PropertyType.land:
        return 'success';
      default:
        break;
    }
  }

  typeLabel() {
    switch (this.type) {
      case PropertyType.residential:
        return 'Residential Real Estate';
      case PropertyType.commercial:
        return 'Commercial Real Estate';
      case PropertyType.industrial:
        return 'Industrial Real Estate';
      case PropertyType.land:
        return 'Land Real Estate';
      default:
        break;
    }
  }
}
