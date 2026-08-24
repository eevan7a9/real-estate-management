import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular';

import { ProfileVerifiedComponent } from './profile-verified.component';

describe('ProfileVerifiedComponent', () => {
  let component: ProfileVerifiedComponent;
  let fixture: ComponentFixture<ProfileVerifiedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideIonicAngular()],
      declarations: [ProfileVerifiedComponent],
      imports: []
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileVerifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
