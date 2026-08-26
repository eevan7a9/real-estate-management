import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ManagementKpiSummaryComponent } from './management-kpi-summary.component';

describe('ManagementKpiSummaryComponent', () => {
  let component: ManagementKpiSummaryComponent;
  let fixture: ComponentFixture<ManagementKpiSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementKpiSummaryComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ManagementKpiSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
