import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular';

import { PropertiesCardComponent } from './properties-card.component';

describe('PropertiesCardComponent', () => {
  let component: PropertiesCardComponent;
  let fixture: ComponentFixture<PropertiesCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideIonicAngular()],
      declarations: [PropertiesCardComponent],
      imports: [RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertiesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
