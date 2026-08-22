import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert-card',
  templateUrl: './alert-card.component.html',
  styleUrls: ['./alert-card.component.css'],
  standalone: false
})
export class AlertCardComponent {
  @Input() color = 'danger';
  @Input() content = 'Alert Something is wrong';

  constructor() {}
}
