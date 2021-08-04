import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { PropertiesService } from './properties/properties.service';
import { properties } from './shared/dummy-data';
import { StorageService } from './shared/services/storage/storage.service';

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
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Settings', url: '/settings', icon: 'cog' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    private platform: Platform,
    private storage: StorageService,
    private propertiesService: PropertiesService
  ) { }

  async ngOnInit() {
    await this.platform.ready();
    await this.storage.init();
    const isDark = await this.storage.getDartTheme();
    // SET THEME
    if (isDark) {
      document.body.classList.add('dark');
    }
    // SET DATA PROPERTIES
    if (!this.propertiesService.properties.length) {
      this.propertiesService.properties = properties;
    }
  }
}
