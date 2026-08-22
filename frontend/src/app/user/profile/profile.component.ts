import { AfterViewInit, Component, signal } from '@angular/core';
import { UserDetails } from 'src/app/shared/interface/user';
import { UserService } from '../user.service';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { RestrictionService } from 'src/app/shared/services/restriction/restriction.service';
import { firstValueFrom } from 'rxjs';
import { errorHandler } from '@app/shared/utility/requests';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: false
})
export class ProfileComponent {
  public imgUrl: any = './assets/images/avatar.png';
  public user = toSignal<UserDetails>(this.userService.user$);
  public userForm: UntypedFormGroup;
  public isActivityActive = signal(true);

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private restriction: RestrictionService
  ) {
    this.userForm = this.formBuilder.group({
      fullName: [
        this.user()?.fullName || '',
        [Validators.required, Validators.minLength(4)]
      ],
      about: [this.user()?.about || '', [Validators.maxLength(1000)]],
      address: [this.user()?.address || '', [Validators.maxLength(1000)]]
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
    if (this.restriction.restricted) {
      return this.restriction.showAlert();
    }
    try {
      const res = await firstValueFrom(
        this.userService.updateUser(this.userForm.value)
      );
      const { status, message } = res;
      if (status === 200) {
        return this.toastCtrl
          .create({
            message: message || 'Profile updated successfully',
            color: 'success',
            duration: 5000
          })
          .then((toast) => toast.present());
      }
      console.error('Update User error:', message);
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse) {
        let { message } = errorHandler(error);
        this.toastCtrl
          .create({
            message,
            color: 'danger',
            duration: 5000
          })
          .then((toast) => toast.present());
      }
      console.error('Update User error:', error);
    }
  }

  public toggleActivityPropertyTab(): void {
    this.isActivityActive.set(!this.isActivityActive());
  }
}
