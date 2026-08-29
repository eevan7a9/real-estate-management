import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SharedModule } from '../../shared/shared.module';

import { ManagementQuickActionComponent } from './management-quick-action.component';

describe('ManagementQuickActionComponent', () => {
  let component: ManagementQuickActionComponent;
  let fixture: ComponentFixture<ManagementQuickActionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementQuickActionComponent],
      imports: [SharedModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ManagementQuickActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
