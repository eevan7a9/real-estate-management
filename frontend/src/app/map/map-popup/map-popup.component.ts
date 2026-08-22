import { ChangeDetectorRef, Component, Input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { PropertiesService } from 'src/app/properties/properties.service';
import {
  PropertyMap,
  PropertyMapPopup
} from 'src/app/shared/interface/property';

@Component({
  selector: 'app-map-popup',
  templateUrl: './map-popup.component.html',
  styleUrls: ['./map-popup.component.css'],
  standalone: false
})
export class MapPopupComponent {
  @Input() property: PropertyMap | undefined;
  public isLoading = signal<boolean>(false);
  public propertyDetails = signal<PropertyMapPopup | undefined>(undefined);

  constructor(
    public changeDetector: ChangeDetectorRef,
    private router: Router,
    private propertiesService: PropertiesService,
    private toastCtrl: ToastController
  ) {}

  viewMore() {
    this.router.navigate(['/properties', this.property?.property_id]);
  }

  public async onPopupOpen() {
    if (this.isLoading() || !this.property?.property_id) return;
    this.isLoading.set(true);

    const params = new URLSearchParams();
    params.append('slim', 'true');

    try {
      const res = await firstValueFrom(
        this.propertiesService.fetchProperty(this.property?.property_id, params)
      );
      console.log('MapPopupComponent onPopupOpen res:', res);
      if (res && res.data) {
        return this.propertyDetails.set(res.data);
      }
      this.toastCtrl
        .create({
          message: 'Failed to fetch property details.',
          duration: 3000,
          color: 'danger'
        })
        .then((toast) => toast.present());
    } catch (error) {
      let message = 'An error occurred while fetching property details.';
      if (error instanceof Error) {
        message = error.message || message;
      }
      this.toastCtrl
        .create({
          message: message,
          duration: 3000,
          color: 'danger'
        })
        .then((toast) => toast.present());
      console.error('MapPopupComponent onPopupOpen unknown error:', error);
    } finally {
      this.isLoading.set(false);
      console.log(
        'MapPopupComponent onPopupOpen finally, isLoading:',
        this.propertyDetails()
      );
      this.changeDetector.detectChanges();
    }
  }
}
