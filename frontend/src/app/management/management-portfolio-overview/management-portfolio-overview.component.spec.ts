import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManagementPortfolioOverviewComponent } from './management-portfolio-overview.component';
import { PropertiesService } from '@app/properties/properties.service';
import { BehaviorSubject } from 'rxjs';
import { Property } from '@app/shared/interface/property';
import { TransactionType, PropertyType } from '@app/shared/enums/property';

describe('ManagementPortfolioOverviewComponent', () => {
  let component: ManagementPortfolioOverviewComponent;
  let fixture: ComponentFixture<ManagementPortfolioOverviewComponent>;
  const ownedProperties$ = new BehaviorSubject<Property[] | undefined>([
    {
      _id: '1',
      property_id: '1',
      name: 'Sale property',
      address: 'Address 1',
      type: PropertyType.residential,
      transactionType: TransactionType.forSale,
      position: { type: 'Point', coordinates: [0, 0] },
      price: 100,
      user_id: 'user'
    },
    {
      _id: '2',
      property_id: '2',
      name: 'Rental property',
      address: 'Address 2',
      type: PropertyType.residential,
      transactionType: TransactionType.forRent,
      position: { type: 'Point', coordinates: [0, 0] },
      price: 100,
      user_id: 'user'
    }
  ]);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementPortfolioOverviewComponent],
      providers: [
        {
          provide: PropertiesService,
          useValue: { propertiesOwned$: ownedProperties$.asObservable() }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManagementPortfolioOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should derive portfolio values from owned properties', () => {
    expect(component.portfolio()).toEqual({
      total: 2,
      forSale: 1,
      forRent: 1
    });
  });
});
