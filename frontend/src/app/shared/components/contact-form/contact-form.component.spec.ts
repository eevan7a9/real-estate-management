import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideIonicAngular } from '@ionic/angular';

import { ContactFormComponent } from './contact-form.component';
import { ContactSubmissionService } from '../../services/contact-submission/contact-submission.service';

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        provideIonicAngular(),
        {
          provide: ContactSubmissionService,
          useValue: jasmine.createSpyObj('ContactSubmissionService', ['create'])
        }
      ],
      declarations: [ContactFormComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
