import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

import { SigninComponent } from './signin.component';
import {
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SigninComponent],
      imports: [
        RouterModule.forRoot([]),
        ReactiveFormsModule
      ],
      providers: [provideIonicAngular(),
        Storage,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
