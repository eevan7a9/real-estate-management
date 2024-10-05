import { Component, Input, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Property } from 'src/app/shared/interface/property';
import { User } from 'src/app/shared/interface/user';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-properties-list-item',
  templateUrl: './properties-list-item.component.html',
  styleUrls: ['./properties-list-item.component.scss'],
})
export class PropertiesListItemComponent {
  public property = input<Property>();
  public user = toSignal<User>(this.userService.user$, {
    initialValue: undefined,
  });
  @Input() enableOwnedBadge = false;

  constructor(private router: Router, private userService: UserService) {}

  public selectProperty(property: Property): void {
    this.router.navigate(['/properties', property.property_id]);
  }
}
