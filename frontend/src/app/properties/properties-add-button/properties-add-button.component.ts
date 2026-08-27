import { Component, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@app/user/user.service';
import { ModalController, ToastController } from '@ionic/angular';
import { PropertiesNewComponent } from '../properties-new-modal/properties-new.component';
import { Property } from '@app/shared/interface/property';
import { PropertiesUploadsComponent } from '../properties-uploads-modal/properties-uploads.component';

@Component({
  selector: 'app-properties-add-button',
  templateUrl: './properties-add-button.component.html',
  styleUrls: ['./properties-add-button.component.css'],
  standalone: false
})
export class PropertiesAddButtonComponent implements OnInit {
  public isFab = input(false);

  constructor(
    private userService: UserService,
    private modalController: ModalController,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {}

  async presentModal() {
    const user = this.userService.user;
    if (!user) {
      this.router.navigateByUrl('/user/signin');
      this.toastCtrl
        .create({
          message: 'Please sign in, to continue',
          duration: 3000,
          color: 'danger'
        })
        .then((toast) => toast.present());
      return;
    }
    const modalPropertiesNew = await this.modalController.create({
      component: PropertiesNewComponent
    });
    await modalPropertiesNew.present();
    const { data } = await modalPropertiesNew.onDidDismiss();
    if (data) {
      this.presentUploadModal(data);
    }
  }

  private async presentUploadModal(property: Property) {
    const modalUploads = await this.modalController.create({
      component: PropertiesUploadsComponent,
      componentProps: { property }
    });
    await modalUploads.present();
  }
}
