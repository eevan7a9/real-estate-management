import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/lazy';

import { PropertyTypeBadgeComponent } from './property-type-badge.component';

describe('PropertyTypeBadgeComponent', () => {
  let component: PropertyTypeBadgeComponent;
  let fixture: ComponentFixture<PropertyTypeBadgeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PropertyTypeBadgeComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyTypeBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
