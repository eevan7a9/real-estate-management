import { Component, effect, signal } from '@angular/core';
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
  public readonly defaultProfileImage = './assets/images/avatar.png';
  public imgUrl: string | ArrayBuffer | null = null;
  public isUploadingImage = signal(false);
  public user = toSignal<UserDetails>(this.userService.user$);
  public userForm: UntypedFormGroup;
  public isActivityActive = signal(true);
  public isSocialLinksVisible = signal(false);

  private readonly httpUrlValidator = Validators.pattern(/^https?:\/\/.+/i);

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private restriction: RestrictionService
  ) {
    this.userForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(4)]],
      about: ['', [Validators.maxLength(1000)]],
      address: ['', [Validators.maxLength(300)]],
      role: ['owner', [Validators.required]],
      businessName: ['', [Validators.maxLength(150)]],
      licenseNumber: ['', [Validators.maxLength(100)]],
      publicLocation: this.formBuilder.group({
        city: ['', [Validators.maxLength(100)]],
        region: ['', [Validators.maxLength(100)]],
        country: ['', [Validators.maxLength(100)]]
      }),
      phone: ['', [Validators.maxLength(30)]],
      showPhone: [false],
      showEmail: [false],
      links: this.formBuilder.group({
        website: ['', [Validators.maxLength(500), this.httpUrlValidator]],
        facebook: ['', [Validators.maxLength(500), this.httpUrlValidator]],
        instagram: ['', [Validators.maxLength(500), this.httpUrlValidator]],
        linkedin: ['', [Validators.maxLength(500), this.httpUrlValidator]],
        x: ['', [Validators.maxLength(500), this.httpUrlValidator]],
        youtube: ['', [Validators.maxLength(500), this.httpUrlValidator]],
        tiktok: ['', [Validators.maxLength(500), this.httpUrlValidator]]
      })
    });

    effect(() => {
      const user = this.user();
      if (!user || this.userForm.dirty) return;

      this.userForm.patchValue({
        fullName: user.fullName,
        about: user.about || '',
        address: user.address || '',
        role: user.role || 'owner',
        businessName: user.businessName || '',
        licenseNumber: user.licenseNumber || '',
        publicLocation: {
          city: user.publicLocation?.city || '',
          region: user.publicLocation?.region || '',
          country: user.publicLocation?.country || ''
        },
        phone: user.phone || '',
        showPhone: user.showPhone || false,
        showEmail: user.showEmail || false,
        links: {
          website: user.links?.website || '',
          facebook: user.links?.facebook || '',
          instagram: user.links?.instagram || '',
          linkedin: user.links?.linkedin || '',
          x: user.links?.x || '',
          youtube: user.links?.youtube || '',
          tiktok: user.links?.tiktok || ''
        }
      });
    });
  }

  public toggleUpload(): void {
    const input = document.getElementById(
      'image-upload'
    ) as HTMLInputElement | null;
    input?.click();
  }

  public async onSelectFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (this.restriction.restricted) {
      input.value = '';
      return this.restriction.showAlert();
    }

    const previousImage =
      this.imgUrl || this.user()?.profileImage || this.defaultProfileImage;
    try {
      this.imgUrl = await this.readImage(file);
      this.isUploadingImage.set(true);
      const res = await firstValueFrom(
        this.userService.uploadProfileImage(file)
      );
      if (res.status !== 200 || !res.data?.profileImage) {
        throw new Error(res.message || 'Unable to upload profile image.');
      }
      this.imgUrl = res.data.profileImage;
      const toast = await this.toastCtrl.create({
        message: res.message || 'Profile image updated successfully',
        color: 'success',
        duration: 5000
      });
      await toast.present();
    } catch (error: unknown) {
      this.imgUrl = previousImage;
      const message =
        error instanceof HttpErrorResponse
          ? errorHandler(error).message
          : error instanceof Error
            ? error.message
            : 'Unable to upload profile image.';
      const toast = await this.toastCtrl.create({
        message,
        color: 'danger',
        duration: 5000
      });
      await toast.present();
    } finally {
      this.isUploadingImage.set(false);
      input.value = '';
    }
  }

  private readImage(file: File): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string | ArrayBuffer);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  public async submit(): Promise<void> {
    if (!this.userForm.valid) {
      this.userForm.markAllAsTouched();
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
        this.userForm.markAsPristine();
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
        const { message } = errorHandler(error);
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

  public toggleSocialLinks(): void {
    this.isSocialLinksVisible.update((isVisible) => !isVisible);
  }
}
