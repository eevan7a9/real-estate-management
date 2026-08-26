import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ManagementPropertiesComponent } from './management-properties.component';

describe('ManagementPropertiesComponent', () => {
  let component: ManagementPropertiesComponent;
  let fixture: ComponentFixture<ManagementPropertiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementPropertiesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ManagementPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
