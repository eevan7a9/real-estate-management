import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular';

import { MapMarkersLegendComponent } from './map-markers-legend.component';

describe('MapMarkersLegendComponent', () => {
  let component: MapMarkersLegendComponent;
  let fixture: ComponentFixture<MapMarkersLegendComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideIonicAngular()],
      declarations: [MapMarkersLegendComponent],
      imports: []
    }).compileComponents();

    fixture = TestBed.createComponent(MapMarkersLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
