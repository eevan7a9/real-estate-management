import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-properties-detail',
  templateUrl: './properties-detail.component.html',
  styleUrls: ['./properties-detail.component.scss'],
})
export class PropertiesDetailComponent implements OnInit {

  constructor(public location: Location) { }

  ngOnInit() { }

}
