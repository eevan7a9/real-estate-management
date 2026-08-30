import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PropertiesService } from '../../../properties/properties.service';
import { SharedModule } from '../../../shared/shared.module';

import { ManagementPropertiesCardComponent } from './management-properties-card.component';

describe('ManagementPropertiesCardComponent', () => {
  let component: ManagementPropertiesCardComponent;
  let fixture: ComponentFixture<ManagementPropertiesCardComponent>;
  let navigate: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    navigate = jasmine.createSpy('navigate');

    TestBed.configureTestingModule({
      declarations: [ManagementPropertiesCardComponent],
      imports: [SharedModule],
      providers: [
        {
          provide: PropertiesService,
          useValue: {
            updatePropertyInState: jasmine.createSpy(),
            updatePropertyStatus: jasmine.createSpy()
          }
        },
        { provide: ToastController, useValue: { create: jasmine.createSpy() } },
        { provide: Router, useValue: { navigate } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManagementPropertiesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigates to the property details page', () => {
    component.selectProperty('property-123');

    expect(navigate).toHaveBeenCalledWith(['/properties', 'property-123']);
  });
});
