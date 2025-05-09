import { Component, computed, Input, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { PopoverController, ToastController } from '@ionic/angular';
import { ActionPopupComponent } from 'src/app/shared/components/action-popup/action-popup.component';
import { Property } from 'src/app/shared/interface/property';
import { User } from 'src/app/shared/interface/user';
import { UserService } from 'src/app/user/user.service';
import { PropertiesService } from '../properties.service';

@Component({
    selector: 'app-properties-list-item',
    templateUrl: './properties-list-item.component.html',
    styleUrls: ['./properties-list-item.component.css'],
    standalone: false
})
export class PropertiesListItemComponent {
  public property = input<Property>();
  public user = toSignal<User>(this.userService.user$, {
    initialValue: undefined,
  });
  public isOwner = computed(
    () => this.user()?.user_id === this.property().user_id
  );
  @Input() enableOwnedBadge = true;

  constructor(
    private router: Router,
    private userService: UserService,
    private popoverCtrler: PopoverController,
    private toastCtrl: ToastController,
    private propertiesService: PropertiesService
  ) { }

  public selectProperty(property: Property): void {
    this.router.navigate(['/properties', property.property_id]);
  }

  public async openPopup(e: Event): Promise<void> {
    e.stopPropagation();
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
      this.deleteProperty(this.property().property_id);
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
    const res = await this.propertiesService.removeProperty(id);
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
  }
}
