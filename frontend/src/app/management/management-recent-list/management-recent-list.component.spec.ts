import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PropertiesService } from '@app/properties/properties.service';
import { Property } from '@app/shared/interface/property';
import { PropertyType, TransactionType } from '@app/shared/enums/property';
import { ManagementRecentListComponent } from './management-recent-list.component';

const createProperty = (
  property_id: string,
  name: string,
  updatedAt: Date
): Property => ({
  _id: property_id,
  property_id,
  name,
  address: 'Manila',
  type: PropertyType.residential,
  transactionType: TransactionType.forSale,
  position: { type: 'Point', coordinates: [0, 0] },
  price: 1_000_000,
  currency: 'PHP',
  user_id: 'user-1',
  updatedAt
});

describe('ManagementRecentListComponent', () => {
  let component: ManagementRecentListComponent;
  let fixture: ComponentFixture<ManagementRecentListComponent>;
  let ownedProperties$: BehaviorSubject<Property[] | undefined>;
  let navigate: jasmine.Spy;
  let navigateByUrl: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    ownedProperties$ = new BehaviorSubject<Property[] | undefined>([]);
    navigate = jasmine.createSpy('navigate');
    navigateByUrl = jasmine.createSpy('navigateByUrl');

    TestBed.configureTestingModule({
      declarations: [ManagementRecentListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: PropertiesService,
          useValue: { propertiesOwned$: ownedProperties$.asObservable() }
        },
        { provide: Router, useValue: { navigate, navigateByUrl } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManagementRecentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('shows the five most recently updated properties', () => {
    ownedProperties$.next(
      Array.from({ length: 6 }, (_, index) =>
        createProperty(
          `property-${index}`,
          `Property ${index}`,
          new Date(2026, 0, index + 1)
        )
      )
    );

    expect(
      component.recentProperties().map((property) => property.name)
    ).toEqual([
      'Property 5',
      'Property 4',
      'Property 3',
      'Property 2',
      'Property 1'
    ]);
  });

  it('filters the recent properties by search term', () => {
    ownedProperties$.next([
      createProperty('sunrise', 'Sunrise Residences', new Date(2026, 0, 2)),
      createProperty('villa', 'Greenfield Villa', new Date(2026, 0, 1))
    ]);

    component.searchTerm.set('greenfield');

    expect(
      component.recentProperties().map((property) => property.name)
    ).toEqual(['Greenfield Villa']);
  });

  it('navigates to the complete properties list', () => {
    component.viewAll();

    expect(navigateByUrl).toHaveBeenCalledWith('/properties');
  });

  it('navigates to the selected property details', () => {
    component.selectProperty('property-123');

    expect(navigate).toHaveBeenCalledWith(['/properties', 'property-123']);
  });
});
