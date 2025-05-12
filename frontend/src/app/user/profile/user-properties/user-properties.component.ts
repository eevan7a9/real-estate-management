import { Component, computed, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
  public properties = toSignal<Property[]>(
    this.propertiesService.propertiesOwned$
  );
  public isLoading = computed(() => this.propertiesService.isLoading());
  public propertiesDisplayOption = PropertiesDisplayOption;
  constructor(private propertiesService: PropertiesService) {}

  ngOnInit() {
    if (!this.propertiesService.propertiesOwned) {
      this.getOwnedProperties();
    }
  }

  private async getOwnedProperties(): Promise<void> {
    this.propertiesService.isLoading.set(true);
    const res = await this.propertiesService.fetchOwnedProperties();
    this.propertiesService.isLoading.set(false);

    if (res.status === 200) {
      this.propertiesService.propertiesOwned = res.data;
    }
  }
}
