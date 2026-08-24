import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular';

import { PropertiesListItemComponent } from './properties-list-item.component';

describe('PropertiesListItemComponent', () => {
  let component: PropertiesListItemComponent;
  let fixture: ComponentFixture<PropertiesListItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideIonicAngular()],
      declarations: [PropertiesListItemComponent],
      imports: []
    }).compileComponents();

    fixture = TestBed.createComponent(PropertiesListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
