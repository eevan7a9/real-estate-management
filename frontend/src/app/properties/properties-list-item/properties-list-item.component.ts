import { Component, computed, Input, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { PopoverController, ToastController } from '@ionic/angular';
import { ActionPopupComponent } from 'src/app/shared/components/action-popup/action-popup.component';
import { Property } from 'src/app/shared/interface/property';
import { User } from 'src/app/shared/interface/user';
import { UserService } from 'src/app/user/user.service';
import { PropertiesService } from '../properties.service';
import { firstValueFrom } from 'rxjs';
import { errorHandler } from 'src/app/shared/utility/requests';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationAlertService } from 'src/app/shared/services/confirmation-alert/confirmation-alert.service';

@Component({
  selector: 'app-properties-list-item',
  templateUrl: './properties-list-item.component.html',
  styleUrls: ['./properties-list-item.component.css'],
  standalone: false
})
export class PropertiesListItemComponent {
  public property = input<Property>();
  public user = toSignal<User | undefined>(this.userService.user$, {
    initialValue: undefined,
  });
  public isOwner = computed(
    () => this.user()?.user_id === this.property()?.user_id
  );
  readonly enableOwnedBadge = input<boolean>(true);
  public details = computed(() => {
    return { ...this.property() }
  })

  constructor(
    private router: Router,
    private userService: UserService,
    private popoverCtrler: PopoverController,
    private toastCtrl: ToastController,
    private propertiesService: PropertiesService,
    private confirmationService: ConfirmationAlertService
  ) { }

  public selectProperty(property?: Property): void {
    if (!property) return;
    this.router.navigate(['/properties', property.property_id]);
  }

  public async openPopup(e: Event): Promise<void> {
    e.stopPropagation();
    const property = this.property();
    if (!property) return;
    const popover = await this.popoverCtrler.create({
      component: ActionPopupComponent,
      componentProps: {
        message: false,
        edit: false,
        report: false,
      },
      translucent: true,
      trigger: "popup-trigger-button"
    });
    await popover.present();
    const { data } = await popover.onDidDismiss();
    if (!data) {
      return;
    }
    if (data.action === 'delete') {
      const res = await this.confirmationService.confirm(
        'Delete Property',
        'Are you sure you want to delete this property? This action cannot be undone.',
        'Delete',
        'Cancel'
      );
      if (res) {
        this.deleteProperty(property.property_id);
      }
    }
    if (data.action === 'report') {
      const toast = await this.toastCtrl.create({
        message: 'Success, we will take a look at this property.',
        color: 'success',
        duration: 5000,
      });
      toast.present();
    }
  }

  private async deleteProperty(id: string): Promise<void> {
    try {
      const res = await firstValueFrom(this.propertiesService.removeProperty(id));
      if (res.status === 200) {
        this.propertiesService.removePropertyFromState(id);
        const toast = await this.toastCtrl.create({
          message: res.message,
          color: res.status === 200 ? 'success' : 'danger',
          duration: 4000,
        });
        toast.present();
        this.router.navigate(['/properties']);
      }
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse) {
        const response = errorHandler(error);
        console.error('Delete property error:', response.message);
        const toast = await this.toastCtrl.create({
          message: response.message || 'An error occurred while deleting the property.',
          color: 'danger',
          duration: 4000,
        });
        toast.present();
      } else {
        console.error('Delete property error:', error);
      }
    }
  }
}
