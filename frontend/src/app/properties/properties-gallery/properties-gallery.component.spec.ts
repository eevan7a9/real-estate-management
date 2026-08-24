import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular';

import { PropertiesGalleryComponent } from './properties-gallery.component';

describe('PropertiesGalleryComponent', () => {
  let component: PropertiesGalleryComponent;
  let fixture: ComponentFixture<PropertiesGalleryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideIonicAngular()],
      declarations: [PropertiesGalleryComponent],
      imports: []
    }).compileComponents();

    fixture = TestBed.createComponent(PropertiesGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
