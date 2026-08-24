import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular';
import { EnquiriesPage } from '../enquiries.page';

import { EnquiriesDetailComponent } from './enquiries-detail.component';

describe('EnquiriesDetailComponent', () => {
  let component: EnquiriesDetailComponent;
  let fixture: ComponentFixture<EnquiriesDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideIonicAngular()],
      declarations: [EnquiriesDetailComponent],
      imports: [
        RouterModule.forRoot([
          {
            path: 'enquiries',
            component: EnquiriesPage
          }
        ])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EnquiriesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
