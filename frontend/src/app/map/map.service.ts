import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Coord } from 'src/app/shared/interface/map';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  addTiles(map: L.Map) {
    const tiles = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: `
      '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>,
      &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>
      &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
      `
    });
    tiles.addTo(map);
  }

  addMarker(map: L.Map, coord: Coord): L.Marker {
    const icon = L.icon({
      iconUrl: '../../../assets/images/map/marker-red-house.svg',
      shadowUrl: '../../../assets/images/map/marker-shadow.svg',

      iconSize: [40, 45], // size of the icon
      shadowSize: [40, 55], // size of the shadow
      iconAnchor: [22, 50], // point of the icon which will correspond to marker's location
      shadowAnchor: [5, 40],  // the same for the shadow
      popupAnchor: [-3, -46] // point from which the popup should open relative to the iconAnchor
    });

    const marker = L.marker([coord.lat, coord.lng], { icon })
      .addTo(map)
      .bindPopup(`<h1>I'm a Marker</h1>`);

    marker.on('click', () => {
      console.log(coord);
      console.log('Marker is clicked');
    });
    return marker;
  }
}
