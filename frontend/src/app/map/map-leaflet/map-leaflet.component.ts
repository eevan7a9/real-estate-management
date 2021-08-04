import { Component, ComponentFactoryResolver, Injector, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { PropertiesService } from 'src/app/properties/properties.service';
import { PropertyType } from 'src/app/shared/enums/property';
import { Coord } from 'src/app/shared/interface/map';
import { Property } from 'src/app/shared/interface/property';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import { MapPopupComponent } from '../map-popup/map-popup.component';
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
    private propertiesService: PropertiesService,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private storage: StorageService
  ) { }

  ngOnInit() {
    this.initMap();
  }

  async initMap(): Promise<void> {
    this.map = L.map('mapId', {
      center: [this.center.lat, this.center.lng],
      zoom: 18
    });
    this.map.whenReady(() => {
      setTimeout(() => {
        this.map.invalidateSize();
      }, 1000);
    });
    const isDark = await this.storage.getDartTheme();
    this.mapService.addTiles(this.map, isDark);

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
          this.addPropertyMarker(property);
        });
      });
    }
  }

  private clickEvent(coord: Coord): void {
    const marker = this.mapService.addMarker(this.map, coord);
    this.markers.push(marker);
  }

  private addPropertyMarker(property: Property) {
    // Dynamicaly Add Component to Popup
    const component = this.resolver.resolveComponentFactory(MapPopupComponent).create(this.injector);
    component.instance.property = property;
    component.instance.changeDetector.detectChanges();

    const icon = this.setMarkerIcon(property.type);
    this.mapService.addMarker(this.map, property.position, icon, component);
  }

  private setMarkerIcon(type: string): L.Icon {
    let icon = '';
    switch (type) {
      case PropertyType.house:
        icon = 'marker-red-house.svg';
        break;
      case PropertyType.apartment:
        icon = 'marker-green-apartment.svg';
        break;
      case PropertyType.pad:
        icon = 'marker-orange-pad.svg';
        break;
      case PropertyType.boardingHouse:
        icon = 'marker-purple-boarding.svg';
        break;
    }
    return L.icon({
      iconUrl: '../../../assets/images/map/' + icon,
      shadowUrl: '../../../assets/images/map/marker-shadow.svg',

      iconSize: [40, 45], // size of the icon
      shadowSize: [40, 55], // size of the shadow
      iconAnchor: [22, 50], // point of the icon which will correspond to marker's location
      shadowAnchor: [5, 40],  // the same for the shadow
      popupAnchor: [-3, -46] // point from which the popup should open relative to the iconAnchor
    });
  }
}
