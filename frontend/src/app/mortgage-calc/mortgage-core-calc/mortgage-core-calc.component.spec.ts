import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomValidatorsDirective } from 'src/app/shared/directives/custom-validators.directive';

import { MortgageCoreCalcComponent } from './mortgage-core-calc.component';

describe('MortgageCoreCalcComponent', () => {
  let component: MortgageCoreCalcComponent;
  let fixture: ComponentFixture<MortgageCoreCalcComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MortgageCoreCalcComponent ],
      imports: [IonicModule.forRoot(), ReactiveFormsModule],
      providers: [CustomValidatorsDirective]
    }).compileComponents();

    fixture = TestBed.createComponent(MortgageCoreCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
