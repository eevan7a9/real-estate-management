import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideIonicAngular } from '@ionic/angular';

import { EnquiriesNewFormComponent } from './enquiries-new-form.component';

describe('EnquiriesNewFormComponent', () => {
  let component: EnquiriesNewFormComponent;
  let fixture: ComponentFixture<EnquiriesNewFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideIonicAngular()],
      declarations: [EnquiriesNewFormComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EnquiriesNewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
