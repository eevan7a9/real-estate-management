import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-properties-new',
  templateUrl: './properties-new.component.html',
  styleUrls: ['./properties-new.component.scss'],
})
export class PropertiesNewComponent implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() { }

  public dismissModal() {
    this.modalCtrl.dismiss();
  }
}
