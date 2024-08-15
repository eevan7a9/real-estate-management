import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PropertiesService } from 'src/app/properties/properties.service';
import { TransactionType } from 'src/app/shared/enums/property';
import { Property } from 'src/app/shared/interface/property';
import { UserService } from 'src/app/user/user.service';


@Component({
  selector: 'app-properties-card',
  templateUrl: './properties-card.component.html',
  styleUrls: ['./properties-card.component.scss'],
})
export class PropertiesCardComponent implements OnInit {
  public transactionType = TransactionType;
  @Input() property: Property;

  constructor(
    private propertiesService: PropertiesService,
    private router: Router,
    public userService: UserService
  ) { }

  ngOnInit() { }

  public selectProperty(property: Property) {
    this.propertiesService.property = property;
    this.router.navigate(['/properties', property.property_id]);
  }
}
