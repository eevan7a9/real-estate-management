import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

import { SettingsThemeComponent } from './settings-theme.component';

describe('SettingsThemeComponent', () => {
  let component: SettingsThemeComponent;
  let fixture: ComponentFixture<SettingsThemeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsThemeComponent],
      imports: [],
      providers: [provideIonicAngular(), Storage]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
