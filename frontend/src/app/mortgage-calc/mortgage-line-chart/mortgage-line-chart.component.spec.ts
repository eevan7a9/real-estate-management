import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

import { MortgageLineChartComponent } from './mortgage-line-chart.component';

describe('MortgageLineChartComponent', () => {
  let component: MortgageLineChartComponent;
  let fixture: ComponentFixture<MortgageLineChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MortgageLineChartComponent ],
      imports: [IonicModule.forRoot()],
      providers: [Storage]
    }).compileComponents();

    fixture = TestBed.createComponent(MortgageLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
