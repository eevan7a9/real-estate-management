import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { MortgagePieChartComponent } from './mortgage-pie-chart.component';

describe('MortgagePieChartComponent', () => {
  let component: MortgagePieChartComponent;
  let fixture: ComponentFixture<MortgagePieChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MortgagePieChartComponent],
      imports: [],
      providers: [provideIonicAngular(), Storage]
    }).compileComponents();

    fixture = TestBed.createComponent(MortgagePieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
