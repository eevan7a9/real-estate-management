import { Component, computed, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { PropertiesService } from 'src/app/properties/properties.service';
import { PropertiesDisplayOption } from 'src/app/shared/enums/property';
import { Property } from 'src/app/shared/interface/property';

@Component({
  selector: 'app-user-properties',
  templateUrl: './user-properties.component.html',
  styleUrls: ['./user-properties.component.css'],
  standalone: false
})
export class UserPropertiesComponent implements OnInit {
  private readonly propertiesService: PropertiesService =
    inject(PropertiesService);
  private readonly toast = inject(ToastController);

  public properties = toSignal<Property[]>(
    this.propertiesService.propertiesOwned$
  );
  public isLoading = computed(() => this.propertiesService.isLoading());
  public propertiesDisplayOption = PropertiesDisplayOption;

  ngOnInit() {
    if (!this.propertiesService.propertiesOwned) {
      this.getOwnedProperties();
    }
  }

  private async getOwnedProperties(): Promise<void> {
    this.propertiesService.isLoading.set(true);
    try {
      const res = await firstValueFrom(
        this.propertiesService.fetchOwnedProperties()
      );
      if (res.status === 200) {
        this.propertiesService.propertiesOwned = res.data;
      }
    } catch (error) {
      console.error('Error fetching owned properties:', error);
      this.toast
        .create({
          message: 'Failed to load properties. Please try again later.',
          duration: 3000,
          color: 'danger'
        })
        .then((toast) => toast.present());
    } finally {
      this.propertiesService.isLoading.set(false);
    }
  }
}
