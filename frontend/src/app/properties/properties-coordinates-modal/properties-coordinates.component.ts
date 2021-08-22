import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Coord } from 'src/app/shared/interface/map';

@Component({
  selector: 'app-properties-coordinates',
  templateUrl: './properties-coordinates.component.html',
  styleUrls: ['./properties-coordinates.component.scss'],
})
export class PropertiesCoordinatesComponent implements OnInit {
  @Input() title = 'Set Property Marker';
  public coord: Coord;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() { }

  public setCoord(event: Coord) {
    this.coord = event;
  }

  public confirmed() {
    this.modalCtrl.dismiss(this.coord);
  }

  public dismissModal() {
    this.modalCtrl.dismiss();
  }
}
