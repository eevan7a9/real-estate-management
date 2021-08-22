import { Component, ComponentFactoryResolver, EventEmitter, Injector, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
export class MapLeafletComponent implements OnInit, OnChanges {

  @Input() clickAddMarker = false;
  @Input() showPropertyMarkers = true;
  @Input() visibleMarkerType: string[] = [];
  @Output() clickedAt = new EventEmitter<Coord>();

  private properties: Property[] = [];
  private map: L.Map;
  private mapGroupMarkers = {
    [PropertyType.residential]: null,
    [PropertyType.commercial]: null,
    [PropertyType.industrial]: null,
    [PropertyType.land]: null
  };
  private center = { lat: 8.947416086535465, lng: 125.5451552207221 };
  private markers: L.Marker[] = [];
  private pendingMarker = [];

  constructor(
    private mapService: MapService,
    private propertiesService: PropertiesService,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private storage: StorageService,
    private activatedRoutes: ActivatedRoute
  ) { }

  ngOnInit() {
    this.propertiesService.properties$.subscribe(properties => {
      this.properties = properties;
    });
    this.initMap().then(() => {

      this.map.on('dragend', () => {
        const center = this.map.getCenter();
        console.log('drag ended.', center);
      });
      const lat = this.activatedRoutes.snapshot.queryParamMap.get('lat');
      const lng = this.activatedRoutes.snapshot.queryParamMap.get('lng');
      if (lat && lng) {
        this.findMarker(Number(lat), Number(lng));
      }
    });
  }

  ngOnChanges() {
    if (this.map) {
      // remove all
      this.map.removeLayer(this.mapGroupMarkers.residential);
      this.map.removeLayer(this.mapGroupMarkers.commercial);
      this.map.removeLayer(this.mapGroupMarkers.industrial);
      this.map.removeLayer(this.mapGroupMarkers.land);
      // add included
      if (this.visibleMarkerType.includes(PropertyType.residential)) {
        this.map.addLayer(this.mapGroupMarkers.residential);
      }
      if (this.visibleMarkerType.includes(PropertyType.commercial)) {
        this.map.addLayer(this.mapGroupMarkers.commercial);
      }
      if (this.visibleMarkerType.includes(PropertyType.industrial)) {
        this.map.addLayer(this.mapGroupMarkers.industrial);
      }
      if (this.visibleMarkerType.includes(PropertyType.land)) {
        this.map.addLayer(this.mapGroupMarkers.land);
      }
    }
  }

  public setMapCenter(coord: Coord) {
    this.map.flyTo([coord.lat, coord.lng], 19);
  }

  public findMarker(lat: number, lng: number) {
    const foundMarker = this.markers.find(marker => {
      const latLng = marker.getLatLng();
      return latLng.lat === lat && latLng.lng === lng;
    });
    this.map.flyTo(foundMarker.getLatLng(), 19);
    setTimeout(() => {
      foundMarker.openPopup();
    }, 1000);
  }

  private async initMap(): Promise<void> {
    const coord = await this.storage.getCoord();
    if (coord) {
      this.center = coord;
    }
    this.map = L.map('mapId', {
      center: [this.center.lat, this.center.lng],
      zoom: 18,
      minZoom: 16,
      zoomControl: false
    });
    L.control.zoom({
      position: 'bottomleft'
    }).addTo(this.map);
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
        if (this.pendingMarker.length) {
          this.pendingMarker.forEach(marker => {
            this.map.removeLayer(marker);
          });
        }
        this.pinMarker(e.latlng);
        this.clickedAt.emit(e.latlng);
      });
    }

    if (this.showPropertyMarkers) {
      // set Properties Markers
      this.setMapMarkers();
    }
  }

  private setMapMarkers() {
    let residential = [];
    let commercial = [];
    let industrial = [];
    let land = [];

    const group = this.properties.reduce((arr, acc): any => {
      arr[acc.type] = [...arr[acc.type] || [], acc];
      return arr;
    }, {});

    if (group.residential && group.residential.length) {
      residential = group.residential.map((property: Property) => property.position
        ? this.addPropertyMarker(property) : undefined).filter(property => property !== undefined);
    }
    if (group.commercial && group.commercial.length) {
      commercial = group.commercial.map((property: Property) => property.position
        ? this.addPropertyMarker(property) : undefined).filter(property => property !== undefined);
    }
    if (group.industrial && group.industrial.length) {
      industrial = group.industrial.map((property: Property) => property.position
        ? this.addPropertyMarker(property) : undefined).filter(property => property !== undefined);
    }
    if (group.land && group.land.length) {
      land = group.land.map((property: Property) => property.position
        ? this.addPropertyMarker(property) : undefined).filter(property => property !== undefined);
    }
    this.mapGroupMarkers = {
      residential: L.layerGroup(residential),
      commercial: L.layerGroup(commercial),
      industrial: L.layerGroup(industrial),
      land: L.layerGroup(land)
    };
    const ctrl = L.control.layers(this.mapGroupMarkers);
    ctrl.addTo(this.map);
    ctrl.remove();
    this.map.addLayer(this.mapGroupMarkers.residential);
    this.map.addLayer(this.mapGroupMarkers.commercial);
    this.map.addLayer(this.mapGroupMarkers.industrial);
    this.map.addLayer(this.mapGroupMarkers.land);
  }


  private pinMarker(coord: Coord): void {
    const icon = this.setMarkerIcon();
    const marker = this.mapService.addMarker(this.map, coord, { icon, popup: '' });
    marker.addTo(this.map);
    this.pendingMarker.push(marker);
  }

  private addPropertyMarker(property: Property) {
    // Dynamicaly Add Component to Popup
    const component = this.resolver.resolveComponentFactory(MapPopupComponent).create(this.injector);
    component.instance.property = property;
    component.instance.changeDetector.detectChanges();

    const icon = this.setMarkerIcon(property.type);
    const marker = this.mapService.addMarker(this.map, property.position, { icon, popup: component });
    this.markers.push(marker);
    return marker;
  }

  private setMarkerIcon(type: string = ''): L.Icon {
    let icon = '';
    switch (type) {
      case PropertyType.residential:
        icon = 'marker-residential.svg';
        break;
      case PropertyType.commercial:
        icon = 'marker-commercial.svg';
        break;
      case PropertyType.industrial:
        icon = 'marker-industrial.svg';
        break;
      case PropertyType.land:
        icon = 'marker-land.svg';
        break;
      default:
        icon = 'default-marker.svg';
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
