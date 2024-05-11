import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NeedSigninContinueComponent } from './need-signin-continue.component';

describe('NeedSigninContinueComponent', () => {
  let component: NeedSigninContinueComponent;
  let fixture: ComponentFixture<NeedSigninContinueComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NeedSigninContinueComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NeedSigninContinueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
