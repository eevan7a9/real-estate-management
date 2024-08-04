import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Enquiry } from 'src/app/shared/interface/enquiry';
import { EnquiriesService } from '../enquiries.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { sortListByDate, sortListByName } from 'src/app/shared/utility';
import {UserService} from "../../user/user.service";

@Component({
  selector: 'app-enquiries-list',
  templateUrl: './enquiries-list.component.html',
  styleUrls: ['./enquiries-list.component.scss'],
})
export class EnquiriesListComponent implements OnDestroy {

  @Output() isLoading = new EventEmitter<boolean>();
  @Output() filterSort = new EventEmitter<{ filterBy: string[], sortBy: string }>();
  public date = new Date();
  public enquiries: Enquiry[] = [];
  public filterBy: string[] = [];
  public sortBy = 'latest';
  public searchText = '';
  private unsubscribe$ = new Subject<void>();
  private userId: string;

  constructor(
    private enquiriesService: EnquiriesService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }


  ngOnDestroy() {
    this.unSubscribed();
  }

  public onParentDidEnter() {
    this.userId = this.userService.user.user_id;

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['filter']) {
        this.filterBy = params['filter'].split(',');
      }
      else this.filterBy = [];

      if (params['sort']) this.sortBy = params['sort'];

      this.filterSort.emit({
        filterBy: this.filterBy,
        sortBy: this.sortBy
      });

      this.getEnquiries();
    });
  }

  public selectEnquiry(enquiry: Enquiry) {
    this.router.navigate(['/enquiries', enquiry.enquiry_id]);
  }

  public setFilters(filter: string[]) {
    this.router.navigate([window.location.pathname],
      {
        queryParams: {filter: filter.length ? filter.join() : null},
        queryParamsHandling: "merge"
      });
  }

  public setSort(sort: string) {
    this.router.navigate([window.location.pathname],
      {
        queryParams: {sort: sort},
        queryParamsHandling: "merge"
      });
  }

  public setSearch(text: string) {
    text = text.trim().toLowerCase();
    if (this.searchText !== text) {
      this.searchText = text;
      this.getEnquiries();
    }
  }

  private sortEnquiries() {
    switch (this.sortBy) {
      case 'title':
        this.enquiries = sortListByName(this.enquiries, { property: 'title' });
        break;
      case 'oldest':
        this.enquiries = sortListByDate(this.enquiries, { latest: false, property: 'createdAt' });
        break;
      default:
        this.enquiries = sortListByDate(this.enquiries, { property: 'createdAt' });
        break;
    }
  }

  private searchEnquiries() {
    return this.enquiries.filter((item: Enquiry) => {
      const title = item.title.toLowerCase();
      const email = item.email.toLowerCase();
      return title.includes(this.searchText) || email.includes(this.searchText);
    });
  }

  private async getEnquiries() {
    this.unSubscribed();
    this.isLoading.emit(true);
    this.enquiriesService.enquiries$.pipe(takeUntil(this.unsubscribe$)).subscribe((enquiries) => {
      this.enquiries = enquiries;
      this.sortEnquiries();

      if (this.searchText) {
        this.enquiries = this.searchEnquiries();
      }
      if (this.filterBy.length) {
        if (this.filterBy.find(filter => filter === 'sent'))
          this.enquiries = this.enquiries.filter(item => this.userId === item.users.from.user_id);
        else if (this.filterBy.find(filter => filter === 'received'))
          this.enquiries = this.enquiries.filter(item => this.userId !== item.users.from.user_id);

        const filtersWithoutSentAndReceived = this.filterBy.filter(filter => !['sent', 'received'].includes(filter))
        if (filtersWithoutSentAndReceived.length)
          this.enquiries = this.enquiries.filter(item => filtersWithoutSentAndReceived.includes(item.topic));
      }
      if (this.enquiriesService.initialFetchDone) {
        this.isLoading.emit(false);
      }
    });
  }

  private unSubscribed() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
