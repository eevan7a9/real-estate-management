import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/lazy';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { Property } from 'src/app/shared/interface/property';

import { PropertiesListComponent } from './properties-list.component';

describe('PropertiesListComponent', () => {
  let component: PropertiesListComponent;
  let fixture: ComponentFixture<PropertiesListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PropertiesListComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({ sort: 'name', search: 'HOUSE' }) }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters before applying the display limit', () => {
    const properties = [
      { property_id: '1', name: 'Apartment', address: 'Main' },
      { property_id: '2', name: 'House', address: 'Main' }
    ] as Property[];

    fixture.componentRef.setInput('properties', properties);
    fixture.componentRef.setInput('limit', 1);
    fixture.detectChanges();

    expect(component.propertiesList().map((property) => property.name)).toEqual(
      ['House']
    );
  });
});
