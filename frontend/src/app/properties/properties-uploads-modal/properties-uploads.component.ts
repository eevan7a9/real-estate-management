import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-properties-uploads',
  templateUrl: './properties-uploads.component.html',
  styleUrls: ['./properties-uploads.component.scss'],
})
export class PropertiesUploadsComponent implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  public dismissModal() {
    this.modalCtrl.dismiss();
  }
}
