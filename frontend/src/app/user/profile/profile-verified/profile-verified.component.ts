import { Component, inject } from '@angular/core';
import { UserService } from '../../user.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile-verified',
  templateUrl: './profile-verified.component.html',
  styleUrls: ['./profile-verified.component.css'],
  standalone: false
})
export class ProfileVerifiedComponent {
  private usersService = inject(UserService);
  readonly user = toSignal(this.usersService.user$)
}
