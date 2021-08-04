import { Component, AfterViewInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StorageService } from 'src/app/shared/services/storage/storage.service';

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
    this.darkTheme = await this.storage.getDartTheme();
  }

  switchDarkMode(event) {
    if (event.detail.checked) {
      document.body.classList.add('dark');
      this.storage.setDarkTheme(true);
    } else {
      document.body.classList.remove('dark');
      this.storage.setDarkTheme(false);
    }
  }
}
