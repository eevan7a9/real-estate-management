import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ToastController } from '@ionic/angular';
import { PropertiesService } from '../../../properties/properties.service';

import { ManagementPropertiesCardComponent } from './management-properties-card.component';

describe('ManagementPropertiesCardComponent', () => {
  let component: ManagementPropertiesCardComponent;
  let fixture: ComponentFixture<ManagementPropertiesCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementPropertiesCardComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        {
          provide: PropertiesService,
          useValue: {
            updatePropertyInState: jasmine.createSpy(),
            updatePropertyStatus: jasmine.createSpy()
          }
        },
        { provide: ToastController, useValue: { create: jasmine.createSpy() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManagementPropertiesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
