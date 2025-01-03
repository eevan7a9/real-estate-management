import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

import { EnquiriesPage } from './enquiries.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('EnquiriesPage', () => {
  let component: EnquiriesPage;
  let fixture: ComponentFixture<EnquiriesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [EnquiriesPage],
    imports: [IonicModule.forRoot(), RouterTestingModule],
    providers: [Storage, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

    fixture = TestBed.createComponent(EnquiriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
