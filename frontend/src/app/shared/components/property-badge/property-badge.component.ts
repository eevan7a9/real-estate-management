import { Component, Input, OnInit } from '@angular/core';
import { PropertyType } from '../../enums/property';

@Component({
  selector: 'app-property-badge',
  templateUrl: './property-badge.component.html',
  styleUrls: ['./property-badge.component.scss'],
})
export class PropertyBadgeComponent implements OnInit {

  @Input() type = 'house';
  constructor() { }

  ngOnInit() { }

  typeColor() {
    switch (this.type) {
      case PropertyType.house:
        return 'danger';
      case PropertyType.pad:
        return 'warning';
      case PropertyType.apartment:
        return 'success';
      case PropertyType.boardingHouse:
        return 'secondary';
      default:
        break;
    }
  }

  typeLabel() {
    switch (this.type) {
      case PropertyType.house:
        return 'Household';
      case PropertyType.pad:
        return 'Pad';
      case PropertyType.apartment:
        return 'Apartment';
      case PropertyType.boardingHouse:
        return 'Boarding House';
      default:
        break;
    }
  }
}
