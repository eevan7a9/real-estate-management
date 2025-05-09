import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-need-signin-continue',
    templateUrl: './need-signin-continue.component.html',
    styleUrls: ['./need-signin-continue.component.css'],
    standalone: false
})
export class NeedSigninContinueComponent implements OnInit {
  constructor(private router: Router, private modalCtrl: ModalController) {}
  @Input() isModal: boolean;

  ngOnInit() {}

  public async goSignin(): Promise<void> {
    if (this.isModal) {
      await this.modalCtrl.dismiss();
    }
    this.router.navigate(['/user/signin']);
  }

  public async close(): Promise<void> {
    await this.modalCtrl.dismiss();
  }
}
