import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationAlertService {
  constructor(private alertController: AlertController) {}

  async confirm(
    header: string,
    message: string,
    confirmText = 'Delete',
    cancelText = 'Cancel'
  ): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header,
        message,
        buttons: [
          {
            text: cancelText,
            role: 'cancel',
            handler: () => resolve(false)
          },
          {
            text: confirmText,
            role: 'destructive',
            handler: () => resolve(true)
          }
        ]
      });

      await alert.present();
    });
  }
}
