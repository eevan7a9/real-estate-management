import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { PropertiesService } from '@app/properties/properties.service';
import {
  PaymentFrequency,
  PropertyType,
  TransactionType
} from '@app/shared/enums/property';
import { Property } from '@app/shared/interface/property';

@Component({
  selector: 'app-management-recent-list',
  templateUrl: './management-recent-list.component.html',
  styleUrls: ['./management-recent-list.component.css'],
  standalone: false
})
export class ManagementRecentListComponent {
  private readonly propertiesService = inject(PropertiesService);
  private readonly router = inject(Router);

  public readonly searchTerm = signal('');
  public readonly ownedProperties = toSignal<
    Property[] | undefined,
    Property[]
  >(this.propertiesService.propertiesOwned$, { initialValue: [] });

  public readonly recentProperties = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();

    return [...(this.ownedProperties() ?? [])]
      .sort(
        (first, second) => this.getDateValue(second) - this.getDateValue(first)
      )
      .filter((property) => this.matchesSearch(property, query))
      .slice(0, 5);
  });

  public readonly hasProperties = computed(
    () => (this.ownedProperties() ?? []).length > 0
  );

  public viewAll(): void {
    void this.router.navigateByUrl('/management/properties');
  }

  public formatType(type: PropertyType): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  public formatTransactionType(transactionType: TransactionType): string {
    return transactionType === TransactionType.forRent
      ? 'For rent'
      : 'For sale';
  }

  public formatValue(property: Property): string {
    const amount = new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: property.currency || 'PHP',
      maximumFractionDigits: 0
    }).format(Number(property.price) || 0);

    return property.transactionType === TransactionType.forRent
      ? `${amount} / ${this.formatFrequency(property.paymentFrequency)}`
      : amount;
  }

  public formatUpdatedAt(property: Property): string {
    const date = this.getPropertyDate(property);
    if (!date) return 'Not available';

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const propertyDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const dayDifference = Math.round(
      (today.getTime() - propertyDay.getTime()) / 86_400_000
    );

    if (dayDifference === 0) return 'Today';
    if (dayDifference === 1) return 'Yesterday';

    return new Intl.DateTimeFormat('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }

  private matchesSearch(property: Property, query: string): boolean {
    if (!query) return true;

    return [
      property.name,
      property.address,
      this.formatType(property.type),
      this.formatTransactionType(property.transactionType)
    ].some((value) => value.toLowerCase().includes(query));
  }

  private formatFrequency(frequency?: PaymentFrequency): string {
    return frequency || PaymentFrequency.monthly;
  }

  private getDateValue(property: Property): number {
    return this.getPropertyDate(property)?.getTime() ?? 0;
  }

  private getPropertyDate(property: Property): Date | undefined {
    const value = property.updatedAt || property.createdAt;
    if (!value) return undefined;

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }
}
