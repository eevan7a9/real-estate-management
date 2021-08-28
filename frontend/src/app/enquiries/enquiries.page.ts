import { Component, OnInit } from '@angular/core';
import { EnquiryTopic } from '../shared/enums/enquiry';
import { PropertyType } from '../shared/enums/property';
import { User } from '../shared/interface/user';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-enquiries',
  templateUrl: './enquiries.page.html',
  styleUrls: ['./enquiries.page.scss'],
})
export class EnquiriesPage implements OnInit {
  public progressBar = false;
  public search = '';
  public filterBy: string[] = [];
  public filters = [
    {
      value: EnquiryTopic.info,
      label: 'Information'
    },
    {
      value: EnquiryTopic.sales,
      label: 'Sales'
    },
    {
      value: EnquiryTopic.schedule,
      label: 'Schedule'
    },
    {
      value: EnquiryTopic.payment,
      label: 'Payment'
    },
  ];
  public sortBy = 'latest';
  public sorts = [
    {
      value: 'latest',
      label: 'Latest'
    },
    {
      value: 'title',
      label: 'Title'
    },
  ];
  public user: User;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.user$.subscribe(user => this.user = user);
  }

  public async presentLoading() {
    this.progressBar = true;
    setTimeout(() => this.progressBar = false, 1500);
  }
}
