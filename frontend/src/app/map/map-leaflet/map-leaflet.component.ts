import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  inject,
  input,
  OnChanges,
  OnDestroy,
  output,
  signal,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { PropertiesService } from 'src/app/properties/properties.service';
import { PropertyType } from 'src/app/shared/enums/property';
import { Coord } from 'src/app/shared/interface/map';
import { Property, PropertyMap } from 'src/app/shared/interface/property';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import { MapPopupComponent } from '../map-popup/map-popup.component';
import { MapService } from '../map.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-map-leaflet',
  templateUrl: './map-leaflet.component.html',
  styleUrls: ['./map-leaflet.component.css'],
  standalone: false
})
export class MapLeafletComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  public isLoading = signal<boolean>(false);
  public clickAddMarker = input<boolean>(false);
  public showPropertyMarkers = input<boolean>(true);
  public visibleMarkerType = input<string[]>([]);
  public detectMouseMove = input<boolean>(false);

  public clickedAt = output<Coord>();

  private properties: PropertyMap[] = [];
  private map!: L.Map;
  private mapGroupMarkers: Record<string, L.LayerGroup | undefined> = {
    [PropertyType.residential]: undefined,
    [PropertyType.commercial]: undefined,
    [PropertyType.industrial]: undefined,
    [PropertyType.land]: undefined
  };
  private center = { lat: 8.947416086535465, lng: 125.5451552207221 };
  private markers: L.Marker[] = [];
  private pendingMarker: L.Marker[] = [];
  private popupComponents: ComponentRef<MapPopupComponent>[] = [];
  private pendingMapTarget: Coord | undefined;
  private markersInitialized = false;
  private destroyed = false;
  private mapClickHandler: ((event: L.LeafletMouseEvent) => void) | undefined;
  private mapMoveEndHandler: (() => void) | undefined;

  @ViewChild('mapElement', { static: true })
  private mapElement!: ElementRef<HTMLDivElement>;

  private mapService = inject(MapService);
  private propertiesService = inject(PropertiesService);
  private containerRef = inject(ViewContainerRef);
  private storage = inject(StorageService);
  private activatedRoutes = inject(ActivatedRoute);

  private moveEndTimeout: ReturnType<typeof setTimeout> | undefined;
  private popupOpenTimeout: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    this.activatedRoutes.queryParamMap
      .pipe(takeUntilDestroyed())
      .subscribe((e) => {
        const lat = e.get('lat');
        const lng = e.get('lng');
        const target = { lat: Number(lat), lng: Number(lng) };
        if (
          lat !== null &&
          lng !== null &&
          Number.isFinite(target.lat) &&
          Number.isFinite(target.lng)
        ) {
          this.pendingMapTarget = target;
          this.focusMapTarget();
        }
      });
    this.propertiesService.propertiesMap$
      .pipe(takeUntilDestroyed())
      .subscribe((properties) => {
        this.properties = properties || [];
        if (this.map && this.showPropertyMarkers() && this.markersInitialized) {
          this.setMapMarkers();
          this.focusMapTarget();
        }
      });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnChanges(): void {
    if (!this.map) return;

    if (!this.showPropertyMarkers()) {
      this.clearPropertyMarkers();
      this.markersInitialized = false;
      this.configureMapInteractions();
      return;
    } else if (!this.markersInitialized) {
      this.setMapMarkers();
      this.markersInitialized = true;
    }

    this.syncVisibleLayers();
    this.configureMapInteractions();
  }

  private syncVisibleLayers(): void {
    if (!this.map) return;

    Object.values(this.mapGroupMarkers).forEach((group) => {
      if (group) this.map.removeLayer(group);
    });

    const visibleTypes = this.visibleMarkerType();
    Object.entries(this.mapGroupMarkers).forEach(([type, group]) => {
      if (group && visibleTypes.includes(type)) this.map.addLayer(group);
    });
  }

  private configureMapInteractions(): void {
    if (!this.map) return;

    if (this.mapClickHandler) {
      this.map.off('click', this.mapClickHandler);
      this.mapClickHandler = undefined;
    }
    if (this.clickAddMarker()) {
      this.mapClickHandler = (event: L.LeafletMouseEvent) => {
        this.pendingMarker.forEach((marker) => marker.remove());
        this.pendingMarker = [];
        this.pinMarker(event.latlng);
        this.clickedAt.emit(event.latlng);
      };
      this.map.on('click', this.mapClickHandler);
    }

    if (this.mapMoveEndHandler) {
      this.map.off('moveend', this.mapMoveEndHandler);
      this.mapMoveEndHandler = undefined;
    }
    if (this.detectMouseMove()) {
      this.mapMoveEndHandler = () => {
        if (this.moveEndTimeout) clearTimeout(this.moveEndTimeout);
        this.moveEndTimeout = setTimeout(() => this.onMouseMove(), 1000);
      };
      this.map.on('moveend', this.mapMoveEndHandler);
    }
  }

  public setMapCenter(coord: Coord) {
    if (!this.map) return;
    this.map.flyTo([coord.lat, coord.lng], 19);
  }

  public findMarker(lat: number, lng: number) {
    if (!this.map) {
      this.pendingMapTarget = { lat, lng };
      return;
    }

    const tolerance = 0.000001;
    const foundMarker = this.markers.find((marker) => {
      const latLng = marker.getLatLng();
      return (
        Math.abs(latLng.lat - lat) <= tolerance &&
        Math.abs(latLng.lng - lng) <= tolerance
      );
    });

    this.map.flyTo(foundMarker?.getLatLng() || [lat, lng], 19);
    if (foundMarker) {
      this.popupOpenTimeout = setTimeout(() => {
        foundMarker.openPopup();
      }, 1000);
    }

    this.pendingMapTarget = undefined;
  }

  private focusMapTarget(): void {
    if (!this.pendingMapTarget || !this.map || !this.markers.length) {
      return;
    }

    const { lat, lng } = this.pendingMapTarget;
    this.findMarker(lat, lng);
  }

  private async initMap(): Promise<void> {
    const coord = await this.storage.getCoord();
    if (this.destroyed) return;
    if (coord) {
      this.center = coord;
    }
    this.map = L.map(this.mapElement.nativeElement, {
      center: [this.center.lat, this.center.lng],
      zoom: 18,
      maxZoom: 21,
      minZoom: 17,
      zoomControl: false
    });
    L.control
      .zoom({
        position: 'bottomleft'
      })
      .addTo(this.map);

    this.map.whenReady(() => {
      setTimeout(() => {
        this.map.invalidateSize();
      }, 1000);
    });

    const isDark = await this.storage.getDartTheme();
    if (this.destroyed) return;
    this.mapService.addTiles(this.map, isDark);

    this.configureMapInteractions();

    if (
      this.showPropertyMarkers() &&
      !this.propertiesService.propertiesMap.length
    ) {
      this.isLoading.set(true);
      try {
        const res = await firstValueFrom(
          this.propertiesService.fetchMapProperties()
        );
        if (this.destroyed) return;
        this.propertiesService.propertiesMap = res.data || [];
      } catch (error) {
        console.error('Failed to load map properties', error);
      } finally {
        this.isLoading.set(false);
      }
    }
    if (this.destroyed) return;
    if (this.showPropertyMarkers()) {
      this.setMapMarkers();
      this.markersInitialized = true;
      this.syncVisibleLayers();
      this.focusMapTarget();
    }
  }

  private setMapMarkers() {
    this.clearPropertyMarkers();

    let residential = [];
    let commercial = [];
    let industrial = [];
    let land = [];

    if (!this.properties) return;

    const group = this.properties?.reduce((arr, acc): any => {
      arr[acc.type] = [...(arr[acc.type] || []), acc];
      return arr;
    }, {});

    if (group.residential && group.residential.length) {
      residential = group.residential
        .map((property: Property) =>
          property.position ? this.addPropertyMarker(property) : undefined
        )
        .filter((property: unknown) => property !== undefined);
    }
    if (group.commercial && group.commercial.length) {
      commercial = group.commercial
        .map((property: Property) =>
          property.position ? this.addPropertyMarker(property) : undefined
        )
        .filter((property: unknown) => property !== undefined);
    }
    if (group.industrial && group.industrial.length) {
      industrial = group.industrial
        .map((property: Property) =>
          property.position ? this.addPropertyMarker(property) : undefined
        )
        .filter((property: unknown) => property !== undefined);
    }
    if (group.land && group.land.length) {
      land = group.land
        .map((property: Property) =>
          property.position ? this.addPropertyMarker(property) : undefined
        )
        .filter((property: unknown) => property !== undefined);
    }

    this.mapGroupMarkers = {
      residential: L.layerGroup(residential),
      commercial: L.layerGroup(commercial),
      industrial: L.layerGroup(industrial),
      land: L.layerGroup(land)
    };

    if (this.mapGroupMarkers.residential)
      this.map.addLayer(this.mapGroupMarkers.residential);
    if (this.mapGroupMarkers.commercial)
      this.map.addLayer(this.mapGroupMarkers.commercial);
    if (this.mapGroupMarkers.industrial)
      this.map.addLayer(this.mapGroupMarkers.industrial);
    if (this.mapGroupMarkers.land) this.map.addLayer(this.mapGroupMarkers.land);
  }

  private clearPropertyMarkers(): void {
    Object.values(this.mapGroupMarkers).forEach((group) => {
      if (group && this.map) this.map.removeLayer(group);
    });
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];
    this.popupComponents.forEach((component) => component.destroy());
    this.popupComponents = [];
  }

  private pinMarker(coord: Coord): void {
    const iconPin = this.setMarkerIcon();
    const marker = this.mapService.addMarker(this.map, coord, {
      icon: iconPin,
      popup: null
    });
    marker.addTo(this.map);
    this.pendingMarker.push(marker);
  }

  private addPropertyMarker(property: Property): L.Marker | undefined {
    const coordinates = property.position?.coordinates;
    if (
      !coordinates ||
      coordinates.length < 2 ||
      !Number.isFinite(coordinates[0]) ||
      !Number.isFinite(coordinates[1])
    )
      return undefined;

    const popupComponent = this.containerRef.createComponent(
      MapPopupComponent,
      {
        index: undefined,
        projectableNodes: []
      }
    );

    popupComponent.instance.property = property;
    popupComponent.changeDetectorRef.detectChanges();

    const domElem = (popupComponent.hostView as any)
      .rootNodes[0] as HTMLElement;

    const markerIcon = this.setMarkerIcon(property.type);
    const marker = this.mapService.addMarker(
      this.map,
      {
        lat: coordinates[1],
        lng: coordinates[0]
      },
      {
        icon: markerIcon,
        popup: domElem
      }
    );
    marker.addEventListener('popupopen', async () => {
      if (!popupComponent.instance.propertyDetails()) {
        await popupComponent.instance.onPopupOpen();
      }
    });
    marker.addTo(this.map);
    this.markers.push(marker);
    this.popupComponents.push(popupComponent);
    this.containerRef.detach(
      this.containerRef.indexOf(popupComponent.hostView)
    );

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
      iconUrl: 'assets/images/map/' + icon,
      shadowUrl: 'assets/images/map/marker-shadow.svg',

      iconSize: [40, 45], // size of the icon
      shadowSize: [40, 55], // size of the shadow
      iconAnchor: [22, 50], // point of the icon which will correspond to marker's location
      shadowAnchor: [5, 40], // the same for the shadow
      popupAnchor: [-3, -46] // point from which the popup should open relative to the iconAnchor
    });
  }

  private async onMouseMove() {
    console.log(
      '%cMap moveend event triggered',
      'color: blue; font-weight: bold;'
    );
  }
  ngOnDestroy(): void {
    this.destroyed = true;
    if (this.moveEndTimeout) clearTimeout(this.moveEndTimeout);
    if (this.popupOpenTimeout) clearTimeout(this.popupOpenTimeout);
    this.pendingMarker.forEach((marker) => marker.remove());
    this.pendingMarker = [];
    this.clearPropertyMarkers();
    if (this.map) this.map.remove();
  }
}
