import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Storage } from '@ionic/storage-angular';
import { ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { PropertiesAddButtonComponent } from './properties-add-button.component';

describe('PropertiesAddButtonComponent', () => {
  let component: PropertiesAddButtonComponent;
  let fixture: ComponentFixture<PropertiesAddButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PropertiesAddButtonComponent],
      imports: [SharedModule],
      providers: [
        Storage,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: ModalController, useValue: {} },
        { provide: ToastController, useValue: { create: jasmine.createSpy() } },
        { provide: Router, useValue: { navigateByUrl: jasmine.createSpy() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertiesAddButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
