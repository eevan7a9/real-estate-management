import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PropertiesService } from '@app/properties/properties.service';
import { TransactionType } from '@app/shared/enums/property';
import { Property } from '@app/shared/interface/property';

@Component({
  selector: 'app-management-kpi-summary',
  templateUrl: './management-kpi-summary.component.html',
  styleUrls: ['./management-kpi-summary.component.css'],
  standalone: false
})
export class ManagementKpiSummaryComponent {
  private readonly propertiesService = inject(PropertiesService);

  public readonly ownedProperties = toSignal<
    Property[] | undefined,
    Property[]
  >(this.propertiesService.propertiesOwned$, { initialValue: [] });

  public readonly totalProperties = computed(
    () => this.ownedProperties()?.length ?? 0
  );

  public readonly propertiesForSale = computed(
    () =>
      (this.ownedProperties() ?? []).filter(
        (property) => property.transactionType === TransactionType.forSale
      ).length
  );

  public readonly propertiesForRent = computed(
    () =>
      (this.ownedProperties() ?? []).filter(
        (property) => property.transactionType === TransactionType.forRent
      ).length
  );

  public readonly portfolioValue = computed(() =>
    (this.ownedProperties() ?? [])
      .filter(
        (property) => property.transactionType === TransactionType.forSale
      )
      .reduce((total, property) => total + (Number(property.price) || 0), 0)
  );

  public readonly portfolioValueLabel = computed(() =>
    new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 1
    }).format(this.portfolioValue())
  );
}
