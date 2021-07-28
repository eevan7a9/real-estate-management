import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-settings-theme',
  templateUrl: './settings-theme.component.html',
  styleUrls: ['./settings-theme.component.scss'],
})
export class SettingsThemeComponent implements OnInit {

  public darkTheme = false;
  constructor(private platform: Platform) { }

  ngOnInit() { }

  switchDarkMode(event) {
    if (this.platform.ready) {
      if (event.detail.checked) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    }
  }
}
