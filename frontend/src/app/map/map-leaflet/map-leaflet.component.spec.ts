import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import * as L from 'leaflet';
import { of } from 'rxjs';
import { PropertiesService } from 'src/app/properties/properties.service';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import { MapService } from '../map.service';
import { MapLeafletComponent } from './map-leaflet.component';

describe('MapLeafletComponent theme', () => {
  let fixture: ComponentFixture<MapLeafletComponent>;
  let mapService: jasmine.SpyObj<MapService>;
  let tiles: L.TileLayer;
  let map: L.Map;
  let originallyDark: boolean;

  const deliverMutations = () =>
    new Promise<void>((resolve) => setTimeout(resolve, 0));

  beforeEach(async () => {
    originallyDark = document.body.classList.contains('dark');
    document.body.classList.remove('dark');
    tiles = L.tileLayer('https://example.com/{z}/{x}/{y}.png');
    mapService = jasmine.createSpyObj<MapService>('MapService', [
      'addTiles',
      'updateTileTheme'
    ]);
    mapService.addTiles.and.callFake((instance) => {
      map = instance;
      return tiles;
    });
    await TestBed.configureTestingModule({
      declarations: [MapLeafletComponent],
      imports: [RouterModule.forRoot([])],
      providers: [
        { provide: MapService, useValue: mapService },
        {
          provide: StorageService,
          useValue: { getCoord: () => Promise.resolve(undefined) }
        },
        {
          provide: PropertiesService,
          useValue: { propertiesMap$: of([]), propertiesMap: [] }
        }
      ]
    })
      .overrideComponent(MapLeafletComponent, {
        set: { template: '<div #mapElement></div>' }
      })
      .compileComponents();
    fixture = TestBed.createComponent(MapLeafletComponent);
    fixture.componentRef.setInput('showPropertyMarkers', false);
  });

  afterEach(() => {
    fixture.destroy();
    document.body.classList.remove('map-theme-test');
    document.body.classList.toggle('dark', originallyDark);
  });

  async function initializeMap(): Promise<void> {
    fixture.detectChanges();
    await deliverMutations();
  }

  it('initializes light tiles from the applied theme', async () => {
    await initializeMap();
    expect(mapService.addTiles).toHaveBeenCalledOnceWith(map, false);
  });

  it('initializes dark tiles from the applied theme', async () => {
    document.body.classList.add('dark');
    await initializeMap();
    expect(mapService.addTiles).toHaveBeenCalledOnceWith(map, true);
  });

  it('updates both ways without recreating the map or changing its position', async () => {
    await initializeMap();
    map.setView([8.95, 125.55], 19);
    const center = map.getCenter();
    document.body.classList.add('dark');
    await deliverMutations();
    expect(mapService.updateTileTheme).toHaveBeenCalledWith(tiles, true);
    document.body.classList.remove('dark');
    await deliverMutations();
    expect(mapService.updateTileTheme).toHaveBeenCalledWith(tiles, false);
    expect(mapService.updateTileTheme).toHaveBeenCalledTimes(2);
    expect(mapService.addTiles).toHaveBeenCalledTimes(1);
    expect(map.getCenter()).toEqual(center);
    expect(map.getZoom()).toBe(19);
  });

  it('ignores class changes that do not change the theme', async () => {
    await initializeMap();
    document.body.classList.add('map-theme-test');
    await deliverMutations();
    expect(mapService.updateTileTheme).not.toHaveBeenCalled();
  });

  it('stops observing when destroyed, including queued changes', async () => {
    await initializeMap();
    document.body.classList.add('dark');
    fixture.destroy();
    await deliverMutations();
    document.body.classList.remove('dark');
    await deliverMutations();
    expect(mapService.updateTileTheme).not.toHaveBeenCalled();
  });
});
