import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular';

import { MapSearchFieldComponent } from './map-search-field.component';

describe('MapSearchFieldComponent', () => {
  let component: MapSearchFieldComponent;
  let fixture: ComponentFixture<MapSearchFieldComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideIonicAngular()],
      declarations: [MapSearchFieldComponent],
      imports: []
    }).compileComponents();

    fixture = TestBed.createComponent(MapSearchFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
