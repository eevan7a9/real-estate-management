import { Component, AfterViewInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-settings-theme',
  templateUrl: './settings-theme.component.html',
  styleUrls: ['./settings-theme.component.scss']
})
export class SettingsThemeComponent implements AfterViewInit {

  public darkTheme = false;
  constructor(private platform: Platform, private storage: StorageService) { }

  async ngAfterViewInit() {
    await this.storage.init();
    this.darkTheme = await this.storage.get('isDark');
  }

  switchDarkMode(event) {
    if (event.detail.checked) {
      document.body.classList.add('dark');
      this.storage.set('isDark', true);
    } else {
      document.body.classList.remove('dark');
      this.storage.set('isDark', false);
    }

  }
}
