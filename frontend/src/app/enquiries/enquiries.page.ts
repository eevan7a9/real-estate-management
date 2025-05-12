import {
  AfterViewInit,
  Component,
  computed,
  signal,
  ViewChild,
} from '@angular/core';
import { EnquiryTopic } from '../shared/enums/enquiry';
import { UserService } from '../user/user.service';
import { EnquiriesListComponent } from './enquiries-list/enquiries-list.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { EnquiriesService } from './enquiries.service';
import {
  IonSearchbarCustomEvent,
  IonSelectCustomEvent,
  SearchbarChangeEventDetail,
  SelectChangeEventDetail,
} from '@ionic/core';

@Component({
    selector: 'app-enquiries',
    templateUrl: './enquiries.page.html',
    styleUrls: ['./enquiries.page.css'],
    standalone: false
})
export class EnquiriesPage implements AfterViewInit {
  @ViewChild(EnquiriesListComponent) enquiriesList: EnquiriesListComponent;
  public search = signal<string>('');
  public filterBy = signal<string[]>([]);
  public sortBy = signal<string>('latest');
  public user = toSignal(this.userService.user$, { initialValue: undefined });
  public enquiriesReady = computed(() =>
    this.enquiriesService.initialFetchDone()
  );

  public filters = [
    {
      value: EnquiryTopic.info,
      label: 'Information',
    },
    {
      value: EnquiryTopic.sales,
      label: 'Sales',
    },
    {
      value: EnquiryTopic.schedule,
      label: 'Schedule',
    },
    {
      value: EnquiryTopic.payment,
      label: 'Payment',
    },
    {
      value: 'sent',
      label: 'Sent',
    },
    {
      value: 'received',
      label: 'Received',
    },
  ];
  public sorts = [
    {
      value: 'latest',
      label: 'Latest',
    },
    {
      value: 'oldest',
      label: 'Oldest',
    },
    {
      value: 'title',
      label: 'Title',
    },
  ];

  private queryParams = toSignal(this.activatedRoute.queryParams);

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private enquiriesService: EnquiriesService
  ) {}

  public ngAfterViewInit(): void {
    const { filter, sort, search } = this.queryParams();
    if (filter?.length) this.filterBy.set(filter.split(','));
    if (sort) this.sortBy.set(sort);
    if (search) this.search.set(search);
  }

  public setSearchedText(
    event: IonSearchbarCustomEvent<SearchbarChangeEventDetail>
  ): void {
    const value = event.detail.value;
    this.router.navigate([window.location.pathname], {
      queryParams: { search: value || null },
      queryParamsHandling: 'merge',
    });
  }

  public setFilters(
    event: IonSelectCustomEvent<SelectChangeEventDetail<string[]>>
  ): void {
    const value = event.detail.value;
    this.router.navigate([window.location.pathname], {
      queryParams: { filter: value.length ? value.join() : null },
      queryParamsHandling: 'merge',
    });
  }

  public setSort(event: IonSelectCustomEvent<SelectChangeEventDetail>): void {
    const value = event.detail.value;
    this.router.navigate([window.location.pathname], {
      queryParams: { sort: value },
      queryParamsHandling: 'merge',
    });
  }
}
