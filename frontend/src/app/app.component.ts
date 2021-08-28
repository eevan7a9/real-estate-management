import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { User } from './shared/interface/user';

import { StorageService } from './shared/services/storage/storage.service';
import { UserService } from './user/user.service';

interface NavLinks {
  title: string;
  url: string;
  icon: string;
  signIn?: boolean;
  guest?: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages: NavLinks[] = [
    { title: 'Map', url: '/map', icon: 'map' },
    { title: 'Properties', url: '/properties', icon: 'home' },
    { title: 'Enquiries', url: '/enquiries', icon: 'reader' },
    { title: 'Mortgage Calc', url: '/mortgage-calc', icon: 'calculator' },
    { title: 'Settings', url: '/settings', icon: 'cog' },
  ];

  public appLowerPages: NavLinks[] = [
    { title: 'About', url: '/about', icon: 'help-circle' },
    { title: 'Account', url: '/user/account', icon: 'person', signIn: true },
    { title: 'Register', url: '/user/register', icon: 'create', guest: true },
    { title: 'Sign In', url: '/user/signin', icon: 'log-in', guest: true },
  ];

  public user: User;

  constructor(
    private platform: Platform,
    private storage: StorageService,
    private userService: UserService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.platform.ready();
    await this.storage.init();
    const isDark = await this.storage.getDartTheme();
    // SET THEME
    if (isDark) {
      document.body.classList.add('dark');
    }

    this.userService.user$.subscribe(user => this.user = user);

    setTimeout(() => {
      console.log(this.user);
    }, 2000);
  }

  public isHidden(link: NavLinks) {
    if (!link.signIn && !link.guest) {
      return;
    }
    if (link.signIn && this.user) {
      return;
    }
    if (link.guest && !this.user) {
      return;
    }
    return true;
  }

  public async signOut() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Are you sure?',
      message: 'You will be <strong>Signed out </strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        }, {
          text: 'Sign out',
          cssClass: 'danger',
          handler: async () => {
            await this.userService.signOut();
            this.showToast();
            this.router.navigate(['/map']);
          }
        }
      ]
    });
    await alert.present();
  }

  private async showToast() {
    const toast = await this.toastController.create({
      message: 'Success, you have signed out.',
      color: 'success',
      duration: 3000
    });
    toast.present();
  }


}
