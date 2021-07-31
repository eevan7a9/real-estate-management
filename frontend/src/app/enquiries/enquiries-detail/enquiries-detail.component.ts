import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enquiries-detail',
  templateUrl: './enquiries-detail.component.html',
  styleUrls: ['./enquiries-detail.component.scss'],
})
export class EnquiriesDetailComponent implements OnInit {

  constructor(
    public location: Location,
    private router: Router
  ) { }

  ngOnInit() { }

}
