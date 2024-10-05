import { Component, computed, input, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Property } from 'src/app/shared/interface/property';
import {
  sortListByDate,
  sortListByName,
  sortListByNumber,
} from 'src/app/shared/utility';
import { PropertiesService } from '../properties.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  PropertiesDisplayOption,
  PropertyType,
  TransactionType,
} from 'src/app/shared/enums/property';

@Component({
  selector: 'app-properties-list',
  templateUrl: './properties-list.component.html',
  styleUrls: ['./properties-list.component.scss'],
})
export class PropertiesListComponent {
  @ViewChild('IonInfiniteScroll', { static: false })
  infinityScroll: IonInfiniteScroll;

  public singleCol = input<boolean>(false);
  public horizontalSlide = input<boolean>(false);
  public limit = input<number>(0);
  public disableInfinitLoader = input<boolean>(false);
  public displayOption = input<PropertiesDisplayOption>(
    PropertiesDisplayOption.CardView
  );

  public properties = input<Property[]>();
  public enableOwnedBadge = input<boolean>(false);
  private queryParams = toSignal(this.activatedRoute.queryParams);

  public propertiesList = computed<Property[]>(() => {
    if(!this.properties()) {
      return [];
    }

    let temp = this.limit()
      ? this.properties().slice(0, this.limit())
      : this.properties();
    const { sort, search, filter } = this.queryParams();
    if (search) temp = this.searchProperties(search, temp);
    if (filter) temp = this.filterProperties(filter, temp);
    temp = this.sortProperties(sort || 'latest', temp);
    return temp;
  });

  constructor(
    private propertiesService: PropertiesService,
    private activatedRoute: ActivatedRoute
  ) { }

  public loadMoreProperty(): void {
    console.log('loadMore');
  }

  private searchProperties(text: string, properties: Property[]): Property[] {
    return properties.filter((item: Property) => {
      const name = item.name.toLowerCase();
      const address = item.address.toLowerCase();
      return name.includes(text) || address.includes(text);
    });
  }

  private filterProperties(
    filter: string,
    properties: Property[] = []
  ): Property[] {
    if (!filter) return;
    const sale = filter.includes(TransactionType.forSale);
    const rent = filter.includes(TransactionType.forRent);
    const propertyType =
      filter.includes(PropertyType.commercial) ||
      filter.includes(PropertyType.industrial) ||
      filter.includes(PropertyType.land) ||
      filter.includes(PropertyType.residential);

    return properties.filter((prprty) => {
      if (sale && prprty.transactionType !== TransactionType.forSale)
        return false;
      if (rent && prprty.transactionType !== TransactionType.forRent)
        return false;
      if (propertyType && !filter.includes(prprty.type)) return false;
      return true;
    });
  }

  private sortProperties(
    sortBy: string,
    properties: Property[] = []
  ): Property[] {
    switch (sortBy) {
      case 'name':
        return sortListByName(properties, { property: 'name' });
      case 'price':
        return sortListByNumber(properties, { property: 'price' });
      default:
        return sortListByDate(properties, { property: 'updatedAt' });
    }
  }
}
