import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular';

import { MapSidePropertiesComponent } from './map-side-properties.component';

describe('MapSidePropertiesComponent', () => {
  let component: MapSidePropertiesComponent;
  let fixture: ComponentFixture<MapSidePropertiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideIonicAngular()],
      declarations: [MapSidePropertiesComponent],
      imports: []
    }).compileComponents();

    fixture = TestBed.createComponent(MapSidePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
