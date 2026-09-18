import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Coord } from 'src/app/shared/interface/map';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor() {}

  addTiles(map: L.Map, isDark = false): L.TileLayer {
    const mapTiles = isDark
      ? environment.map.tiles.dark
      : environment.map.tiles.default;
    const tiles = L.tileLayer(mapTiles, {
      maxZoom: 21,
      minZoom: 17,
      attribution: `
      '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>,
      &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>
      &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
      `
    });
    tiles.addTo(map);
    return tiles;
  }

  updateTileTheme(tiles: L.TileLayer, isDark: boolean): void {
    tiles.setUrl(
      isDark ? environment.map.tiles.dark : environment.map.tiles.default
    );
  }

  addMarker(
    map: L.Map,
    coord: Coord,
    options: {
      icon: L.Icon<L.IconOptions> | null;
      popup: HTMLElement | null;
    } = { icon: null, popup: null }
  ): L.Marker {
    const marker = L.marker([coord.lat, coord.lng], {
      ...(options.icon ? { icon: options.icon } : '')
    });
    if (options.popup) {
      // marker.bindPopup(options.popup.location.nativeElement);
      marker.bindPopup(options.popup); // options.popup is already an HTMLElement
    }
    // add click event
    marker.on('click', () => {
      const zoom = 19;
      const point = map.project(marker.getLatLng(), zoom);
      // Move the center down by 150px so the marker appears lower on screen
      point.y -= 150;
      const target = map.unproject(point, zoom);

      map.flyTo(target, zoom);
    });
    return marker;
  }
}
