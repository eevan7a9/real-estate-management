import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionType } from 'src/app/shared/enums/property';
import { Property } from 'src/app/shared/interface/property';
import { UserService } from 'src/app/user/user.service';


@Component({
    selector: 'app-properties-card',
    templateUrl: './properties-card.component.html',
    styleUrls: ['./properties-card.component.css'],
    standalone: false
})
export class PropertiesCardComponent {
  public transactionType = TransactionType;
  @Input() property: Property;

  constructor(
    private router: Router,
    public userService: UserService
  ) { }

  public selectProperty(property: Property): void {
    this.router.navigate(['/properties', property.property_id]);
  }
}
