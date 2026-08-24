import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular';

import { UserPropertiesComponent } from './user-properties.component';

describe('UserPropertiesComponent', () => {
  let component: UserPropertiesComponent;
  let fixture: ComponentFixture<UserPropertiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideIonicAngular()],
      declarations: [UserPropertiesComponent],
      imports: []
    }).compileComponents();

    fixture = TestBed.createComponent(UserPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
