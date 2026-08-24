import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular';

import { PropertyTypeBadgeComponent } from './property-type-badge.component';

describe('PropertyTypeBadgeComponent', () => {
  let component: PropertyTypeBadgeComponent;
  let fixture: ComponentFixture<PropertyTypeBadgeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideIonicAngular()],
      declarations: [PropertyTypeBadgeComponent],
      imports: []
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyTypeBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
