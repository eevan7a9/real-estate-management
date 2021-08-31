import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-action-popup',
  templateUrl: './action-popup.component.html',
  styleUrls: ['./action-popup.component.scss'],
})
export class ActionPopupComponent implements OnInit {
  @Input() message = true;
  @Input() edit = true;
  @Input() delete = true;
  constructor(
    private popupCtrl: PopoverController,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() { }

  close(action = null) {
    const user = this.userService.user;
    if (!user) {
      this.router.navigateByUrl('user/signin');
      this.popupCtrl.dismiss();
      return;
    }
    this.popupCtrl.dismiss({ action });
  }
}
