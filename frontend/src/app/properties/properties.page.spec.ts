import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

import { PropertiesPage } from './properties.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PropertiesPage', () => {
  let component: PropertiesPage;
  let fixture: ComponentFixture<PropertiesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [PropertiesPage],
    imports: [IonicModule.forRoot(), RouterTestingModule],
    providers: [Storage, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

    fixture = TestBed.createComponent(PropertiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
