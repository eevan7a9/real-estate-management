import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ManagementPropertiesPage } from './management-properties.page';

describe('ManagementPropertiesPage', () => {
  let component: ManagementPropertiesPage;
  let fixture: ComponentFixture<ManagementPropertiesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementPropertiesPage]
    }).compileComponents();

    fixture = TestBed.createComponent(ManagementPropertiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
