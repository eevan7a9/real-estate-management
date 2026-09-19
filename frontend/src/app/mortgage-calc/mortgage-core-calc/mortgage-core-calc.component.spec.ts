import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonRow,
  provideIonicAngular
} from '@ionic/angular';

import { MortgageCoreCalcComponent } from './mortgage-core-calc.component';

describe('MortgageCoreCalcComponent', () => {
  let component: MortgageCoreCalcComponent;
  let fixture: ComponentFixture<MortgageCoreCalcComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideIonicAngular()],
      declarations: [MortgageCoreCalcComponent],
      imports: [
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        IonCard,
        IonCardContent,
        IonCardHeader,
        IonCardTitle,
        IonCol,
        IonGrid,
        IonIcon,
        IonInput,
        IonItem,
        IonList,
        IonRow
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MortgageCoreCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('calculates the displayed total including tax and insurance', () => {
    let result;
    component.onCalculateMonthly.subscribe((value) => (result = value));

    component.calculateMonthly();

    expect(result.totalMonth).toBeGreaterThan(result.interest);
    expect(result.tax).toBe(150);
    expect(result.insurance).toBe(300);
    expect(component.monthlyPayment()).toBe('1,523.64');
  });

  it('rejects negative interest and invalid loan terms', () => {
    component.mortgageForm.patchValue({ interest: -1 });
    expect(component.mortgageForm.invalid).toBeTrue();

    component.mortgageForm.patchValue({ interest: 5, term: 0 });
    expect(component.mortgageForm.invalid).toBeTrue();
  });

  it('accepts numeric price values without throwing', () => {
    expect(() =>
      component.mortgageForm.patchValue({ price: 300000, downPayment: 100000 })
    ).not.toThrow();
    expect(component.mortgageForm.valid).toBeTrue();
  });

  it('uses an input price with a 20% down payment', () => {
    fixture.componentRef.setInput('price', 30000);
    fixture.detectChanges();

    expect(component.mortgageForm.controls.price.value).toBe('30,000');
    expect(component.mortgageForm.controls.downPayment.value).toBe('6,000');
    expect(component.mortgageForm.valid).toBeTrue();
  });

  it('restores defaults when the input price is removed', () => {
    fixture.componentRef.setInput('price', 30000);
    fixture.detectChanges();
    fixture.componentRef.setInput('price', undefined);
    fixture.detectChanges();

    expect(component.mortgageForm.controls.price.value).toBe('300,000');
    expect(component.mortgageForm.controls.downPayment.value).toBe('100,000');
  });

  it('carries the simple calculator price into the full calculator link', () => {
    fixture.componentRef.setInput('simpleMode', true);
    fixture.componentRef.setInput('price', 30000);
    fixture.detectChanges();

    const link = fixture.debugElement.query(By.directive(RouterLink));
    expect(link.injector.get(RouterLink).queryParams).toEqual({ price: 30000 });
  });

  it('pays the schedule down to zero', () => {
    let schedule;
    component.onCalculateAmortization.subscribe((value) => (schedule = value));

    component.calculateAmortizationSchedule();

    expect(schedule.length).toBe(360);
    expect(schedule[schedule.length - 1].balance).toBe(0);
  });
  it('recalculates after a formatted currency input changes', fakeAsync(() => {
    let result: { totalMonth: number } | undefined;
    component.onCalculateMonthly.subscribe((value) => (result = value));

    component.formatValue(
      { detail: { value: '350000' } } as CustomEvent,
      'price'
    );
    tick(500);

    expect(result?.totalMonth).toBeGreaterThan(1700);
  }));
});
