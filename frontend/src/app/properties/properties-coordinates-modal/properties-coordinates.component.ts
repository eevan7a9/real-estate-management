import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Coord } from 'src/app/shared/interface/map';

@Component({
  selector: 'app-properties-coordinates',
  templateUrl: './properties-coordinates.component.html',
  styleUrls: ['./properties-coordinates.component.scss'],
})
export class PropertiesCoordinatesComponent implements OnInit {

  public coord: Coord;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() { }

  public dismissModal() {
    this.modalCtrl.dismiss();
  }
}
