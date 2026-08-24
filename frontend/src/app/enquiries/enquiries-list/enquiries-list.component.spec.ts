import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular';

import { EnquiriesListComponent } from './enquiries-list.component';

describe('EnquiriesListComponent', () => {
  let component: EnquiriesListComponent;
  let fixture: ComponentFixture<EnquiriesListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideIonicAngular()],
      declarations: [EnquiriesListComponent],
      imports: [RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(EnquiriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
