import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular';

import { PropertiesCurrentImagesComponent } from './properties-current-images.component';

describe('PropertiesCurrentImagesComponent', () => {
  let component: PropertiesCurrentImagesComponent;
  let fixture: ComponentFixture<PropertiesCurrentImagesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideIonicAngular()],
      declarations: [PropertiesCurrentImagesComponent],
      imports: []
    }).compileComponents();

    fixture = TestBed.createComponent(PropertiesCurrentImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
