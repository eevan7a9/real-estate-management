import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular';

import { EnquiriesListItemComponent } from './enquiries-list-item.component';

describe('EnquiriesListItemComponent', () => {
  let component: EnquiriesListItemComponent;
  let fixture: ComponentFixture<EnquiriesListItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideIonicAngular()],
      declarations: [EnquiriesListItemComponent],
      imports: []
    }).compileComponents();

    fixture = TestBed.createComponent(EnquiriesListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
