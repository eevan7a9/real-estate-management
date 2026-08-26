import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Property } from '../shared/interface/property';
import { UserService } from '../user/user.service';
import { PropertiesService } from '@app/properties/properties.service';
import { PropertiesNewComponent } from '@app/properties/properties-new-modal/properties-new.component';
import { ModalController, ToastController } from '@ionic/angular';
import { PropertiesUploadsComponent } from '@app/properties/properties-uploads-modal/properties-uploads.component';

@Component({
  selector: 'app-management',
  templateUrl: './management.page.html',
  styleUrls: ['./management.page.css'],
  standalone: false
})
export class ManagementPage implements OnInit {
  private readonly userService = inject(UserService);
  public readonly user = toSignal(this.userService.user$, {
    initialValue: undefined
  });
  private readonly propertiesService = inject(PropertiesService);
  public readonly router = inject(Router);
  private readonly modalController = inject(ModalController);
  private readonly toastCtrl = inject(ToastController);

  async ngOnInit(): Promise<void> {
    await this.propertiesService.loadOwnedProperties();
  }

  async presentCreateModal() {
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
