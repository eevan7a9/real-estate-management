import { Component, computed, effect, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { PropertiesService } from '@app/properties/properties.service';
import { Property } from '@app/shared/interface/property';
import { UserService } from '@app/user/user.service';

@Component({
  selector: 'app-management-properties',
  templateUrl: './management-properties.page.html',
  styleUrls: ['./management-properties.page.css'],
  standalone: false
})
export class ManagementPropertiesPage {
  private readonly userService = inject(UserService);
  private readonly propertiesService = inject(PropertiesService);

  constructor(public location: Location) {
    effect(() => {
      if (!this.user()?.accessToken) return;
      void this.propertiesService.loadOwnedProperties();
    });
  }

  public readonly user = toSignal(this.userService.user$, {
    initialValue: undefined
  });
  public readonly searchTerm = signal('');
  public readonly ownedProperties = toSignal<
    Property[] | undefined,
    Property[]
  >(this.propertiesService.propertiesOwned$, { initialValue: [] });
  public readonly filteredProperties = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();

    return (this.ownedProperties() ?? []).filter((property) =>
      this.matchesSearch(property, query)
    );
  });
  public readonly isLoading = this.propertiesService.isLoading;
  public readonly loadError = this.propertiesService.error;

  public formatType(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  private matchesSearch(property: Property, query: string): boolean {
    if (!query) return true;

    return [
      property.name,
      property.address,
      property.type,
      property.transactionType === 'rent' ? 'For rent' : 'For sale'
    ].some((value) => value.toLowerCase().includes(query));
  }
}
