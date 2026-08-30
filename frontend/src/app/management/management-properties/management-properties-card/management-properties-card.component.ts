import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { PropertiesService } from '../../../properties/properties.service';
import { Property } from '../../../shared/interface/property';

@Component({
  selector: 'app-management-properties-card',
  templateUrl: './management-properties-card.component.html',
  styleUrls: ['./management-properties-card.component.css'],
  standalone: false
})
export class ManagementPropertiesCardComponent {
  readonly property = input<Property>();
  readonly isUpdating = signal(false);

  private readonly propertiesService = inject(PropertiesService);
  private readonly router = inject(Router);
  private readonly toastController = inject(ToastController);

  public selectProperty(propertyId: string): void {
    void this.router.navigate(['/properties', propertyId]);
  }

  public async onActiveChange(event: CustomEvent<{ checked: boolean }>) {
    const property = this.property();
    if (!property || this.isUpdating()) return;

    const previousIsActive = Boolean(property.isActive);
    const nextIsActive = event.detail.checked;

    this.isUpdating.set(true);
    this.propertiesService.updatePropertyInState({
      ...property,
      isActive: nextIsActive
    });

    try {
      const response = await firstValueFrom(
        this.propertiesService.updatePropertyStatus(
          property.property_id,
          nextIsActive
        )
      );
      if (response.status !== 200 && response.status !== 201)
        throw new Error(
          response.message || 'Unable to update property status.'
        );
      this.propertiesService.updatePropertyInState(response.data);
      await this.presentToast(
        response.message || 'Property status updated.',
        'success'
      );
    } catch (error: unknown) {
      this.propertiesService.updatePropertyInState({
        ...property,
        isActive: previousIsActive
      });
      await this.presentToast(
        error instanceof Error
          ? error.message
          : 'Unable to update property status. Please try again.',
        'danger'
      );
    } finally {
      this.isUpdating.set(false);
    }
  }

  private async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color
    });
    await toast.present();
  }
}
