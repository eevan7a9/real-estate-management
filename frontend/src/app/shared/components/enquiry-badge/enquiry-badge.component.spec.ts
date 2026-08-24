import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular';

import { EnquiryBadgeComponent } from './enquiry-badge.component';

describe('EnquiryBadgeComponent', () => {
  let component: EnquiryBadgeComponent;
  let fixture: ComponentFixture<EnquiryBadgeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideIonicAngular()],
      declarations: [EnquiryBadgeComponent],
      imports: []
    }).compileComponents();

    fixture = TestBed.createComponent(EnquiryBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
