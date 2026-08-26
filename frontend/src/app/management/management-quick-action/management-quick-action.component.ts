import { Component, OnInit, output } from '@angular/core';

@Component({
  selector: 'app-management-quick-action',
  templateUrl: './management-quick-action.component.html',
  styleUrls: ['./management-quick-action.component.css'],
  standalone: false
})
export class ManagementQuickActionComponent implements OnInit {
  public clickCreateProperty = output<void>();
  public clickViewProperties = output<void>();
  public clickViewEnquiries = output<void>();

  constructor() {}

  ngOnInit() {}
}
