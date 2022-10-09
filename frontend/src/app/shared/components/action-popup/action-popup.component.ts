import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController, ToastController } from '@ionic/angular';
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
  @Input() report = true;

  constructor(
    private popupCtrl: PopoverController,
    private userService: UserService,
    private router: Router,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() { }

  close(action = null) {
    const user = this.userService.user;
    if (!user) {
      this.router.navigateByUrl('user/signin');
      this.popupCtrl.dismiss();
      this.toastCtrl.create({
        message: 'Please sign in, to continue',
        duration: 3000,
        color: 'danger'
      }).then(toast => toast.present());
      return;
    }
    this.popupCtrl.dismiss({ action });
  }
}
