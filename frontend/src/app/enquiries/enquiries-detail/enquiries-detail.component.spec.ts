import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { EnquiriesPage } from '../enquiries.page';

import { EnquiriesDetailComponent } from './enquiries-detail.component';

describe('EnquiriesDetailComponent', () => {
  let component: EnquiriesDetailComponent;
  let fixture: ComponentFixture<EnquiriesDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquiriesDetailComponent ],
      imports: [IonicModule.forRoot(), RouterTestingModule.withRoutes([
        {
          path: 'enquiries',
          component: EnquiriesPage
        }
      ])]
    }).compileComponents();

    fixture = TestBed.createComponent(EnquiriesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
