import { Component, OnInit } from '@angular/core';
import { PropertyType } from 'src/app/shared/enums/property';

interface Markers {
  label: string;
  value: string;
  isChecked: boolean;
  icon: string;
}

@Component({
  selector: 'app-map-markers-legend',
  templateUrl: './map-markers-legend.component.html',
  styleUrls: ['./map-markers-legend.component.scss'],
})
export class MapMarkersLegendComponent implements OnInit {

  public markers: Markers[] = [
    {
      label: 'Household',
      value: PropertyType.house,
      isChecked: true,
      icon: 'marker-red-house.svg'
    },
    {
      label: 'Apartment',
      value: PropertyType.apartment,
      isChecked: true,
      icon: 'marker-green-apartment.svg',

    }, {
      label: 'Pad',
      value: PropertyType.pad,
      isChecked: true,
      icon: 'marker-orange-pad.svg'
    }
    , {
      label: 'Boarding House',
      value: PropertyType.boardingHouse,
      isChecked: true,
      icon: 'marker-purple-boarding.svg'
    }
  ];
  constructor() { }

  ngOnInit() { }

  markerSelected(marker: Markers) {
    console.log(marker.isChecked, marker.icon);
  }
}
