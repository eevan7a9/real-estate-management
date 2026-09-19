import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

import { MortgageCalcPage } from './mortgage-calc.page';

describe('MortgageCalcPage', () => {
  let component: MortgageCalcPage;
  let fixture: ComponentFixture<MortgageCalcPage>;
  let queryParamMap: BehaviorSubject<ParamMap>;

  beforeEach(waitForAsync(() => {
    queryParamMap = new BehaviorSubject(convertToParamMap({ price: '30000' }));
    TestBed.configureTestingModule({
      providers: [
        provideIonicAngular(),
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap,
            snapshot: { queryParamMap: queryParamMap.value }
          }
        }
      ],
      declarations: [MortgageCalcPage],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MortgageCalcPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('reads a valid price from the query parameters', () => {
    expect(component.price()).toBe(30000);
  });

  it('ignores malformed and non-positive query prices', () => {
    queryParamMap.next(convertToParamMap({ price: '-100' }));
    expect(component.price()).toBeUndefined();

    queryParamMap.next(convertToParamMap({ price: 'invalid' }));
    expect(component.price()).toBeUndefined();
  });
});
