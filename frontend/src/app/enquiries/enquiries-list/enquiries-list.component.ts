import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-enquiries-list',
  templateUrl: './enquiries-list.component.html',
  styleUrls: ['./enquiries-list.component.scss'],
})
export class EnquiriesListComponent implements OnInit {
  public date = new Date();

  constructor() { }

  ngOnInit() { }

}
