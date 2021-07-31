import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Enquiry } from 'src/app/shared/interface/enquiries';
import { EnquiriesService } from '../enquiries.service';

@Component({
  selector: 'app-enquiries-detail',
  templateUrl: './enquiries-detail.component.html',
  styleUrls: ['./enquiries-detail.component.scss'],
})
export class EnquiriesDetailComponent implements OnInit {
  public enquiry: Enquiry;

  constructor(
    public location: Location,
    private router: Router,
    private enquiriesService: EnquiriesService
  ) { }

  ngOnInit() {
    this.enquiriesService.enquiry$.subscribe(enquiry => {
      this.enquiry = enquiry;
      if (!this.enquiry) {
        this.router.navigate(['/enquiries']);
      }
    });
  }

}
