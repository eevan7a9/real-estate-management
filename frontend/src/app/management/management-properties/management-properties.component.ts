import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-management-properties',
  templateUrl: './management-properties.component.html',
  styleUrls: ['./management-properties.component.css'],
  standalone: false
})
export class ManagementPropertiesComponent implements OnInit {
  constructor(public location: Location) {}

  ngOnInit() {}
}
