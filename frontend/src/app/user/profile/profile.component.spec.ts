import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

import { ProfileComponent } from './profile.component';
import {
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [],
      providers: [
        provideIonicAngular(),
        Storage,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('includes the professional and contact profile controls', () => {
    expect(component.userForm.get('role')?.value).toBe('owner');
    expect(component.userForm.get('businessName')).toBeTruthy();
    expect(component.userForm.get('publicLocation.city')).toBeTruthy();
    expect(component.userForm.get('phone')).toBeTruthy();
    expect(component.userForm.get('showPhone')?.value).toBeFalse();
    expect(component.userForm.get('showEmail')?.value).toBeFalse();
    expect(component.userForm.get('links.linkedin')).toBeTruthy();
  });
});
