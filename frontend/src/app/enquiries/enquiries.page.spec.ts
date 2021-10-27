import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

import { EnquiriesPage } from './enquiries.page';

describe('EnquiriesPage', () => {
  let component: EnquiriesPage;
  let fixture: ComponentFixture<EnquiriesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquiriesPage ],
      imports: [IonicModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      providers: [Storage]
    }).compileComponents();

    fixture = TestBed.createComponent(EnquiriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
