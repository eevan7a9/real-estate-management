import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

import { MapLeafletComponent } from './map-leaflet.component';

describe('MapLeafletComponent', () => {
  let component: MapLeafletComponent;
  let fixture: ComponentFixture<MapLeafletComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MapLeafletComponent],
      imports: [RouterModule.forRoot([])],
      providers: [provideIonicAngular(), Storage]
    }).compileComponents();

    fixture = TestBed.createComponent(MapLeafletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
