import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PropertiesGalleryComponent } from './properties-gallery.component';

describe('PropertiesGalleryComponent', () => {
  let component: PropertiesGalleryComponent;
  let fixture: ComponentFixture<PropertiesGalleryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertiesGalleryComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertiesGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
