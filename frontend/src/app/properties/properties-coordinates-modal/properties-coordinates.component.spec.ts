import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular';

import { PropertiesCoordinatesComponent } from './properties-coordinates.component';

describe('PropertiesCoordinatesComponent', () => {
  let component: PropertiesCoordinatesComponent;
  let fixture: ComponentFixture<PropertiesCoordinatesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideIonicAngular()],
      declarations: [PropertiesCoordinatesComponent],
      imports: []
    }).compileComponents();

    fixture = TestBed.createComponent(PropertiesCoordinatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
