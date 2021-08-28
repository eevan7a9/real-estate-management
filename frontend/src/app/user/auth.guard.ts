import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private user: UserService, private router: Router) { }
  async canActivate() {
    const user = this.user.user;
    // if user is signed in
    if (!!user) {
      this.router.navigate(['/map']);
      return false;
    }
    return true;
  }
}
