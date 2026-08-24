import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

import { ActionPopupComponent } from './action-popup.component';
import {
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';

describe('ActionPopupComponent', () => {
  let component: ActionPopupComponent;
  let fixture: ComponentFixture<ActionPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ActionPopupComponent],
      imports: [RouterModule.forRoot([])],
      providers: [provideIonicAngular(),
        Storage,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ActionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
