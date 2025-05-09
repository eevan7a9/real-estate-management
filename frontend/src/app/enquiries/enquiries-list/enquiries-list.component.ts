import { Component, computed, EventEmitter, Output, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Enquiry } from 'src/app/shared/interface/enquiry';
import { EnquiriesService } from '../enquiries.service';
import { map } from 'rxjs/operators';
import { sortListByDate, sortListByName } from 'src/app/shared/utility';
import { UserService } from "../../user/user.service";
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-enquiries-list',
    templateUrl: './enquiries-list.component.html',
    styleUrls: ['./enquiries-list.component.css'],
    standalone: false
})
export class EnquiriesListComponent {
  @Output() isLoading = new EventEmitter<boolean>();
  public isReceived = signal(false);
  public enquiriesList = computed<Enquiry[]>(() => {
    let temp = this.enquiries();
    const { search, sort, filter } = this.queryParams();
    if (search) temp = this.searchEnquiries(search);
    if (filter) temp = this.filterEnquiries(filter, temp);
    temp = this.sortEnquiries(sort, temp);
    return temp;
  });

  private enquiries = toSignal<Enquiry[]>(this.enquiriesService.enquiries$);
  private queryParams = toSignal(this.activatedRoute.queryParams);
  private userId = toSignal(this.userService.user$.pipe(map(item => item.user_id)), { initialValue: '' });

  constructor(
    private enquiriesService: EnquiriesService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  public selectEnquiry(enquiry: Enquiry) {
    this.router.navigate(['/enquiries', enquiry.enquiry_id]);
  }

  private sortEnquiries(sortBy: string = 'latest', enquiries: Enquiry[] = []) {
    switch (sortBy) {
      case 'title':
        return sortListByName(enquiries, { property: 'title' });
      case 'oldest':
        return sortListByDate(enquiries, { latest: false, property: 'createdAt' });
      default:
        return sortListByDate(enquiries, { property: 'createdAt' });
    }
  }

  private filterEnquiries(filter: string = '', enquiries: Enquiry[] = []): Enquiry[] {
    const isSent = filter.includes('sent');
    const isReceived = filter.includes('received');
    const otherFilters = filter.split(',').filter((filter: string) => !['sent', 'received'].includes(filter));

    return enquiries.filter(item => {
      if (isSent && this.userId() !== item.users.from.user_id) return false;
      if (isReceived && this.userId() === item.users.from.user_id) return false;
      if (otherFilters.length && !otherFilters.includes(item.topic)) return false;
      return true;
    });
  }

  private searchEnquiries(searchText: string = ''): Enquiry[] {
    const textToFind = searchText.toLowerCase();
    return this.enquiries().filter((item: Enquiry) => {
      const title = item.title.toLowerCase();
      const email = item.email.toLowerCase();
      console.log(title.includes(textToFind), email.includes(textToFind));
      return title.includes(textToFind) || email.includes(textToFind);
    });
  }
}
