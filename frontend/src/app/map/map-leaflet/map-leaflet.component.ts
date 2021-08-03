import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Coord } from 'src/app/shared/interface/map';
@Component({
  selector: 'app-map-leaflet',
  templateUrl: './map-leaflet.component.html',
  styleUrls: ['./map-leaflet.component.scss'],
})
export class MapLeafletComponent implements OnInit {

  public markers = [];
  private map: L.Map;
  private center = { lat: 8.947416086535465, lng: 125.5451552207221 };

  constructor() { }

  ngOnInit() {
    this.initMap();
  }

  initMap(): void {
    this.map = L.map('mapId', {
      center: [this.center.lat, this.center.lng],
      zoom: 17
    });
    this.map.whenReady(() => {
      setTimeout(() => {
        this.map.invalidateSize();
      }, 1000);
    });

    const tiles = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: `
      '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>,
      &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>
      &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
      `
    });
    tiles.addTo(this.map);
    // set click event handler
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.clickEvent(e.latlng);
    });
  }

  private addMarker(coord: Coord): void {
    const icon = L.icon({
      iconUrl: '../../../assets/images/map/marker-red-house.svg',
      shadowUrl: '../../../assets/images/map/marker-shadow.svg',

      iconSize: [40, 45], // size of the icon
      shadowSize: [40, 55], // size of the shadow
      iconAnchor: [22, 50], // point of the icon which will correspond to marker's location
      shadowAnchor: [5, 40],  // the same for the shadow
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    const marker = L.marker([coord.lat, coord.lng], { icon }).addTo(this.map);
    marker.on('click', () => {
      console.log('Marker is clicked');
    });
    this.markers.push(marker);
    console.log('Marker is Added.');
  }

  private clickEvent(coord: Coord): void {
    this.addMarker(coord);
  }
}
