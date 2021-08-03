import { Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { PropertiesService } from 'src/app/properties/properties.service';
import { Coord } from 'src/app/shared/interface/map';
import { MapService } from '../map.service';

@Component({
  selector: 'app-map-leaflet',
  templateUrl: './map-leaflet.component.html',
  styleUrls: ['./map-leaflet.component.scss'],
})
export class MapLeafletComponent implements OnInit {

  @Input() clickAddMarker = false;
  @Input() showPropertyMarkers = true;

  public markers = [];
  private map: L.Map;
  private center = { lat: 8.947416086535465, lng: 125.5451552207221 };

  constructor(
    private mapService: MapService,
    private propertiesService: PropertiesService
  ) { }

  ngOnInit() {
    this.initMap();
  }

  initMap(): void {
    this.map = L.map('mapId', {
      center: [this.center.lat, this.center.lng],
      zoom: 18
    });
    this.map.whenReady(() => {
      setTimeout(() => {
        this.map.invalidateSize();
      }, 1000);
    });
    this.mapService.addTiles(this.map);

    if (this.clickAddMarker) {
      // set click event handler
      this.map.on('click', (e: L.LeafletMouseEvent) => {
        this.clickEvent(e.latlng);
      });
    }

    if (this.showPropertyMarkers) {
      // set Properties Markers
      this.propertiesService.properties$.subscribe(properties => {
        this.markers = properties;
        properties.forEach(property => {
          this.mapService.addMarker(this.map, property.position);
        });
      });
    }
  }

  private clickEvent(coord: Coord): void {
    const marker = this.mapService.addMarker(this.map, coord);
    this.markers.push(marker);
  }
}
