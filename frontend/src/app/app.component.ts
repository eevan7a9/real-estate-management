import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

import { StorageService } from './shared/services/storage/storage.service';
import { UserService } from './user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  public appPages = [
    { title: 'Map', url: '/map', icon: 'map' },
    { title: 'Properties', url: '/properties', icon: 'home' },
    { title: 'Enquiries', url: '/enquiries', icon: 'reader' },
    { title: 'Mortgage Calc', url: '/mortgage-calc', icon: 'calculator' },
    { title: 'Settings', url: '/settings', icon: 'cog' },
  ];

  public appLowerPages = [
    { title: 'About', url: '/about', icon: 'help-circle' },
    { title: 'Account', url: '/user/account', icon: 'person' },
    { title: 'Register', url: '/user/register', icon: 'create' },
    { title: 'Sign In', url: '/user/signin', icon: 'log-in' },
  ];

  constructor(
    private platform: Platform,
    private storage: StorageService,
    private user: UserService
  ) { }

  async ngOnInit() {
    await this.platform.ready();
    await this.storage.init();
    const isDark = await this.storage.getDartTheme();
    // SET THEME
    if (isDark) {
      document.body.classList.add('dark');
    }
  }

  public async signOut() {
    await this.user.signOut();
  }
}
