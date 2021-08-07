import { Component, OnInit } from '@angular/core';
import { PropertyType } from '../shared/enums/property';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  public visibleType = [
    PropertyType.residential.toString(),
    PropertyType.commercial.toString(),
    PropertyType.industrial.toString(),
    PropertyType.land.toString()
  ];

  constructor() { }

  ngOnInit() {
  }

  setVisibleMarkerType(event: { type: string; isChecked: boolean }) {
    if (!event.isChecked) {
      this.visibleType = this.visibleType.filter(v => v !== event.type);
    } else {
      this.visibleType = [...this.visibleType, event.type];
    }
  }
}
