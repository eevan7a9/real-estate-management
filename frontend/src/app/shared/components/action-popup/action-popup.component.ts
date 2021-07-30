import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-action-popup',
  templateUrl: './action-popup.component.html',
  styleUrls: ['./action-popup.component.scss'],
})
export class ActionPopupComponent implements OnInit {

  constructor(private popupCtrl: PopoverController) { }

  ngOnInit() { }

  close(action = null) {
    this.popupCtrl.dismiss({ action });
  }
}
