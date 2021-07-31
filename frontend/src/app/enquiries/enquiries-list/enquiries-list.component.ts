import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Enquiry } from 'src/app/shared/interface/enquiries';
import { EnquiriesService } from '../enquiries.service';

@Component({
  selector: 'app-enquiries-list',
  templateUrl: './enquiries-list.component.html',
  styleUrls: ['./enquiries-list.component.scss'],
})
export class EnquiriesListComponent implements OnInit {
  public date = new Date();
  public enquiries: Enquiry[];

  constructor(
    private enquiriesService: EnquiriesService,
    private router: Router) { }

  ngOnInit() {
    this.enquiriesService.enquiries$.subscribe(enquiries => {
      this.enquiries = enquiries;
      if (!this.enquiries.length) {
        this.enquiriesService.enquiries = [
          {
            content: 'lorem20',
            email: 'hello_user@email.com',
            id: '01',
            date: new Date('2020/3/3'),
            title: 'Hello World some.',
            topic: 'schedule',
            read: true,
            property: {
              name: 'Building A, 34-b',
              id: '02',
            },
            user: {
              from: '1',
              to: '2'
            }
          },
          {
            content: 'lorem43 32sad',
            email: 'naruto_zua@email.com',
            id: '02',
            date: new Date('2020/4/3'),
            title: 'Hello Zworld some.',
            topic: 'payment',
            read: false,
            property: {
              name: 'Dart Apartment A, 34-b',
              id: '03',
            },
            user: {
              from: '1',
              to: '2'
            }
          }
        ];
      }
    });
  }

  public selectEnquiry(enquiry: Enquiry) {
    this.enquiriesService.enquiry = enquiry;
    this.router.navigate(['/enquiries', enquiry.id]);
  }
}
