import { Component, computed, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ModalController,
  SelectChangeEventDetail,
  ToastController,
} from '@ionic/angular';
import {
  PropertiesDisplayOption,
  PropertyType,
  TransactionType,
} from '../shared/enums/property';

import { Property } from '../shared/interface/property';
import { UserService } from '../user/user.service';
import { PropertiesNewComponent } from './properties-new-modal/properties-new.component';
import { PropertiesUploadsComponent } from './properties-uploads-modal/properties-uploads.component';

import {
  IonSearchbarCustomEvent,
  IonSelectCustomEvent,
  SearchbarChangeEventDetail,
} from '@ionic/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PropertiesService } from './properties.service';
import { PropertiesListComponent } from './properties-list/properties-list.component';
import { debounce } from '../shared/utility/helpers';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.page.html',
  styleUrls: ['./properties.page.css'],
  standalone: false,
})
export class PropertiesPage implements OnInit {
  @ViewChild('propertyLists') propertyLists!: PropertiesListComponent;
  public search = signal<string>('');
  public filterBy = signal<PropertyType[]>([]);
  public sortBy = signal<string>('latest');
  public disableInfinitScroll = signal(false);

  public displayOption = signal<PropertiesDisplayOption>(
    PropertiesDisplayOption.CardView,
  );

  public properties = toSignal<Property[] | undefined>(this.propertiesService.properties$, {
    initialValue: undefined,
  });

  public status = computed(() => {
    return {
      isLoading: this.propertiesService.isLoading(),
      hasMore: this.propertiesService.hasMore(),
      error: this.propertiesService.error(),
    }
  });

  private limit = 8;

  public displayType = PropertiesDisplayOption;
  public filters = [
    {
      value: PropertyType.residential,
      label: 'Residential type',
    },
    {
      value: PropertyType.commercial,
      label: 'Commercial type',
    },
    {
      value: PropertyType.industrial,
      label: 'Industrial type',
    },
    {
      value: PropertyType.land,
      label: 'Land type',
    },
    {
      value: TransactionType.forSale,
      label: 'For Sale',
    },
    {
      value: TransactionType.forRent,
      label: 'For Rent',
    },
  ];
  public sorts = [
    {
      value: 'latest',
      label: 'Latest',
    },
    {
      value: 'name',
      label: 'Name',
    },
    {
      value: 'price',
      label: 'Price',
    },
  ];
  // public user: User;

  private queryParams = toSignal(this.activatedRoutes.queryParams);

  constructor(
    public modalController: ModalController,
    private userService: UserService,
    private router: Router,
    private toastCtrl: ToastController,
    private propertiesService: PropertiesService,
    private activatedRoutes: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.setCurrentParams();
    if (!this.propertiesService.properties.length) {
      console.log('load more...');
      this.loadMoreProperty();
    }
  }

  async presentModal() {
    const user = this.userService.user;
    if (!user) {
      this.router.navigateByUrl('/user/signin');
      this.toastCtrl
        .create({
          message: 'Please sign in, to continue',
          duration: 3000,
          color: 'danger',
        })
        .then((toast) => toast.present());
      return;
    }
    const modalPropertiesNew = await this.modalController.create({
      component: PropertiesNewComponent,
    });
    await modalPropertiesNew.present();
    const { data } = await modalPropertiesNew.onDidDismiss();
    if (data) {
      this.presentUploadModal(data);
    }
  }

  public setFilters(
    event: IonSelectCustomEvent<SelectChangeEventDetail<string[]>>,
  ): void {
    const value = event.detail.value;
    this.router.navigate([window.location.pathname], {
      queryParams: { filter: value.length ? value.join() : null },
      queryParamsHandling: 'merge',
    });
    this.resetPageState();
    this.loadMoreProperty();
    this.disableInfinitScroll.set(false);
  }

  public setSort(event: IonSelectCustomEvent<SelectChangeEventDetail>): void {
    const value = event.detail.value;
    this.router.navigate([window.location.pathname], {
      queryParams: { sort: value },
      queryParamsHandling: 'merge',
    });
    this.resetPageState();
    this.loadMoreProperty();
    this.disableInfinitScroll.set(false);
  }

  public setSearchedText(
    event: IonSearchbarCustomEvent<SearchbarChangeEventDetail>,
  ): void {
    const value = event.detail.value;
    this.router.navigate([window.location.pathname], {
      queryParams: { search: value || null },
      queryParamsHandling: 'merge',
    });
    this.resetPageState();
    this.loadMoreProperty();
    this.disableInfinitScroll.set(false);
  }

  public loadMoreProperty = debounce(async () => {
    console.log('load more...');
    await this.propertiesService.loadMore(this.queryParams());
    await this.propertyLists.setInfinityScrollComplete();
  }, 1000);

  private setCurrentParams() {
    const queryParams = this.queryParams();
    if (!queryParams) return;

    const { filter, sort } = queryParams;
    if (filter) {
      this.filterBy.set([...filter.split(',')]);
    }
    if (sort) {
      this.sortBy.set(sort || 'latest');
    }
  }

  private async presentUploadModal(property: Property) {
    const modalUploads = await this.modalController.create({
      component: PropertiesUploadsComponent,
      componentProps: { property },
    });
    await modalUploads.present();
  }

  private resetPageState() {
    this.propertiesService.properties = [];
    this.propertiesService.last.set({
      createdAt: '',
      price: '',
      name: '',
      _id: '',
    });
    this.propertiesService.hasMore.set(true);
  }
}
