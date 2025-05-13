import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnquiriesRelatedListComponent } from './enquiries-related-list.component';

describe('EnquiriesRelatedListComponent', () => {
  let component: EnquiriesRelatedListComponent;
  let fixture: ComponentFixture<EnquiriesRelatedListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquiriesRelatedListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EnquiriesRelatedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
