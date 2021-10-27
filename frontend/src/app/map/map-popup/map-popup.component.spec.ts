import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { PropertiesPage } from 'src/app/properties/properties.page';

import { MapPopupComponent } from './map-popup.component';

describe('MapPopupComponent', () => {
  let component: MapPopupComponent;
  let fixture: ComponentFixture<MapPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapPopupComponent ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([{
        component: PropertiesPage,
        path: 'properties'
      }])]
    }).compileComponents();

    fixture = TestBed.createComponent(MapPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
