import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  PropertiesDisplayOption,
  TransactionType
} from '../shared/enums/property';
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
  private userService = inject(UserService);
  private propertiesService = inject(PropertiesService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private modalController = inject(ModalController);
  private toastCtrl = inject(ToastController);

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
