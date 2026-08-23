import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  IonicModule,
  ModalController,
  PopoverController,
  ToastController
} from '@ionic/angular';
import { of } from 'rxjs';
import { PropertiesService } from '../properties.service';
import { UserService } from 'src/app/user/user.service';
import { RestrictionService } from 'src/app/shared/services/restriction/restriction.service';
import { ConfirmationAlertService } from 'src/app/shared/services/confirmation-alert/confirmation-alert.service';
import { Property } from 'src/app/shared/interface/property';

import { PropertiesDetailComponent } from './properties-detail.component';

describe('PropertiesDetailComponent', () => {
  const property = {
    _id: '1',
    property_id: 'property-1',
    name: 'Sample property',
    address: 'Main Street',
    type: 'residential',
    transactionType: 'sale',
    position: { type: 'Point', coordinates: [120, 14] },
    price: 1000000,
    user_id: 'user-1'
  } as Property;
  const propertiesService = {
    fetchProperty: jasmine
      .createSpy()
      .and.returnValue(of({ status: 200, data: property }))
  };
  let component: PropertiesDetailComponent;
  let fixture: ComponentFixture<PropertiesDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PropertiesDetailComponent],
      imports: [IonicModule.forRoot(), RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: 'property-1' })),
            snapshot: { paramMap: convertToParamMap({ id: 'property-1' }) }
          }
        },
        { provide: PropertiesService, useValue: propertiesService },
        { provide: UserService, useValue: { isPropertyOwner: () => false } },
        { provide: PopoverController, useValue: {} },
        { provide: ModalController, useValue: {} },
        { provide: ToastController, useValue: {} },
        { provide: RestrictionService, useValue: {} },
        { provide: ConfirmationAlertService, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertiesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('loads the property for the current route ID', () => {
    expect(component).toBeTruthy();
    expect(propertiesService.fetchProperty).toHaveBeenCalledWith('property-1');
    expect(component.property()).toEqual(property);
  });
});
