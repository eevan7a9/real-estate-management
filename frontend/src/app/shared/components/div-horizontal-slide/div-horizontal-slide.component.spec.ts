import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular';

import { DivHorizontalSlideComponent } from './div-horizontal-slide.component';

describe('DivHorizontalSlideComponent', () => {
  let component: DivHorizontalSlideComponent;
  let fixture: ComponentFixture<DivHorizontalSlideComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideIonicAngular()],
      declarations: [DivHorizontalSlideComponent],
      imports: []
    }).compileComponents();

    fixture = TestBed.createComponent(DivHorizontalSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
