import { Location } from '@angular/common';
import { Component, computed, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  ModalController,
  PopoverController,
  ToastController,
} from '@ionic/angular';

import { Property } from 'src/app/shared/interface/property';
import { PropertiesService } from '../properties.service';
import { ActionPopupComponent } from 'src/app/shared/components/action-popup/action-popup.component';
import { PropertiesEditComponent } from '../properties-edit-modal/properties-edit.component';
import { PropertiesUploadsComponent } from '../properties-uploads-modal/properties-uploads.component';
import { UserService } from 'src/app/user/user.service';
import { PropertiesGalleryComponent } from '../properties-gallery/properties-gallery.component';
import { TransactionType } from 'src/app/shared/enums/property';
import { RestrictionService } from 'src/app/shared/services/restriction/restriction.service';
import { firstValueFrom } from 'rxjs';
import { ConfirmationAlertService } from 'src/app/shared/services/confirmation-alert/confirmation-alert.service';

@Component({
  selector: 'app-properties-detail',
  templateUrl: './properties-detail.component.html',
  styleUrls: ['./properties-detail.component.css'],
  standalone: false,
})
export class PropertiesDetailComponent implements OnInit {
  @ViewChild('propertiesGallery') propertiesGallery: PropertiesGalleryComponent;
  public property = signal<Property | undefined>(undefined);
  public ready = signal(false);
  public isOwner = computed(() => {
    if (this.property()) {
      return this.userService.isPropertyOwner(this.property() as Property);
    }
    return false;
  });
  public transactionType = TransactionType;

  constructor(
    public location: Location,
    private userService: UserService,
    private router: Router,
    private propertiesService: PropertiesService,
    private popoverCtrl: PopoverController,
    public modalController: ModalController,
    private toastCtrl: ToastController,
    private route: ActivatedRoute,
    private restriction: RestrictionService,
    private confirmationService: ConfirmationAlertService,
  ) {
    this.propertiesGallery = new PropertiesGalleryComponent();
  }

  async ngOnInit() {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      await this.setPropertyDetails(paramId);
    }
  }

  public async actionPopup() {
    const popover = await this.popoverCtrl.create({
      component: ActionPopupComponent,
      componentProps: {
        message: false,
        edit: this.isOwner(),
        delete: this.isOwner(),
      },
      translucent: true,
    });
    await popover.present();
    const { data } = await popover.onDidDismiss();
    switch (data?.action) {
      case 'delete':
        if (this.restriction.restricted) {
          return this.restriction.showAlert();
        }
        const res = await this.confirmationService.confirm(
          'Delete Property',
          'Are you sure you want to delete this property? This action cannot be undone.',
          'Delete',
          'Cancel'
        );
        if (res) {
          return this.deleteProperty(this.property()?.property_id || '');
        }

      case 'edit':
        return this.editModal();

      case 'report':
        this.toastCtrl
          .create({
            message: 'Success, we will take a look at this property.',
            color: 'warning',
            duration: 5000,
          })
          .then((e) => e.present());
        break;

      default:
        break;
    }
  }

  public findInMap() {
    const { coordinates: [lat, lng] } = this.property()?.position || { coordinates: [0, 0] };
    this.router.navigate(['/map'], { queryParams: { lat, lng } });
  }

  public async editImages() {
    const modal = await this.modalController.create({
      component: PropertiesUploadsComponent,
      componentProps: {
        property: this.property(),
      },
    });
    modal.present();
    modal.onDidDismiss().then((res) => {
      const deleted = res.data?.deleted || [];
      if (deleted) {
        this.property.update((value) => {
          if (value) {
            value.images = value?.images?.filter(
              (image) => !deleted.includes(image),
            );
          }
          return value;
        });
      }
    });
  }

  private async setPropertyDetails(id: string): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.propertiesService.fetchProperty(id),
      );
      if (res.status === 200 && res.data) {
        this.property.set(res.data);
        if (this.propertiesGallery) {
          this.propertiesGallery.setImage();
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.ready.set(true);
    }
  }

  private async deleteProperty(id: string): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.propertiesService.removeProperty(id)
      );

      if (res.status !== 200) throw new Error(res.message);
      this.propertiesService.removePropertyFromState(id);
      const toast = await this.toastCtrl.create({
        message: res.message,
        color: 'success',
        duration: 4000,
      });
      await toast.present();
      this.router.navigate(['/properties']);
    } catch (error) {
      let message = 'An error occurred while deleting the property.';
      if (error instanceof Error) {
        message = error.message;
      }
      const toast = await this.toastCtrl.create({
        message: message,
        color: 'danger',
        duration: 4000,
      });
      return await toast.present();
    }
  }

  private async editModal() {
    const modal = await this.modalController.create({
      component: PropertiesEditComponent,
      componentProps: {
        property: this.property(),
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data?.property) {
      this.property.set(data.property);
    }
  }
}
