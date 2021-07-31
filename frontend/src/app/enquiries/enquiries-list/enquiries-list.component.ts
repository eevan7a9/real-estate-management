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
            enqId: '01',
            date: new Date('2020/3/3'),
            property: 'Building A, 34-b',
            propId: '02',
            title: 'Hello World some.',
            type: 'apartment'
          },
          {
            content: 'lorem43 32sad',
            email: 'naruto_zua@email.com',
            enqId: '02',
            date: new Date('2020/4/3'),
            property: 'Dart Apartment A, 34-b',
            propId: '03',
            title: 'Hello Zworld some.',
            type: 'house'
          }
        ];
      }
    });
  }

  public selectEnquiry(enquiry: Enquiry) {
    this.enquiriesService.enquiry = enquiry;
    this.router.navigate(['/enquiries', enquiry.enqId]);
  }
}
