import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RestrictionService {
  constructor(private toast: ToastController, private alert: AlertController) {}

  public get restricted(): boolean {
    return environment.features.restrictedMode;
  }

  public showToast(duration?: number, message?: string, heading?: string) {
    this.toast
      .create({
        header:
          environment.features?.restrictedHeading || heading || 'Restricted',
        message:
          environment.features?.restrictedMessage ||
          message ||
          'This feature is currently unavailable!',
        icon: 'alert-circle',
        duration: duration || 8000,
      })
      .then((e) => e.present());
  }

  public showAlert(message?: string, heading?: string) {
    this.alert
      .create({
        header:
          environment.features?.restrictedHeading || heading || 'Restricted',
        message:
          environment.features?.restrictedMessage ||
          message ||
          'This feature is currently unavailable!',
        cssClass: 'text-danger!',
        buttons: [
          {
            text: 'I understand',
            role: 'cancel',
          },
        ],
      })
      .then((e) => e.present());
  }
}
