import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert-card',
  templateUrl: './alert-card.component.html',
  styleUrls: ['./alert-card.component.scss'],
})
export class AlertCardComponent implements OnInit {
  @Input() color = 'danger';
  @Input() content = 'Alert Something is wrong';
  constructor() { }

  ngOnInit() { }

}
