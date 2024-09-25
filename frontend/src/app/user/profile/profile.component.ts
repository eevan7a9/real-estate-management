import { AfterViewInit, Component, signal } from '@angular/core';
import { UserDetails } from 'src/app/shared/interface/user';
import { UserService } from '../user.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ActivitiesService } from 'src/app/activities/activities.service';
import { NotificationsService } from '../notifications/notifications.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  public imgUrl: any = './assets/images/avatar.png';
  public user = toSignal<UserDetails>(this.userService.user$);
  public userForm: UntypedFormGroup;
  public isActivityActive = signal(true);

  constructor(
    private userService: UserService,
    private activitiesService: ActivitiesService,
    private notificationsService: NotificationsService,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController
  ) {
    this.userForm = this.formBuilder.group({
      fullName: [
        this.user()?.fullName || '',
        [Validators.required, Validators.minLength(4)],
      ],
      about: [this.user()?.about || '', [Validators.maxLength(1000)]],
      address: [this.user()?.address || '', [Validators.maxLength(1000)]],
    });
  }

  public toggleUpload() {
    const input = document.getElementById('image-upload');
    input.click();
  }

  public onSelectFile(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (ev) => {
        // called once readAsDataURL is completed
        this.imgUrl = ev.target.result;
        console.log(this.imgUrl);
      };
    }
  }

  public async submit(): Promise<void> {
    if (!this.userForm.valid) {
      return;
    }
    const res = await this.userService.updateUser(this.userForm.value);
    const status = res.status;
    console.log(res);
    if (status === 200) {
      const updatedUser = { ...res.data, accessToken: this.userService.token };
      this.userService.setUser(updatedUser);
    }
    const toast = this.toastCtrl.create({
      message: res.message,
      color: status === 200 ? 'success' : 'danger',
      duration: 5000,
    });
    (await toast).present();
  }

  public toggleActivityPropertyTab(): void {
    this.isActivityActive.set(!this.isActivityActive());
  }
}
