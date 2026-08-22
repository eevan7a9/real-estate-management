import {
  Component,
  EventEmitter,
  input,
  Input,
  OnInit,
  output,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ToastController } from '@ionic/angular';
import { PropertiesService } from '../../properties.service';
import { register } from 'swiper/element/bundle';
import { RestrictionService } from 'src/app/shared/services/restriction/restriction.service';

register();

@Component({
    selector: 'app-properties-current-images',
    templateUrl: './properties-current-images.component.html',
    styleUrls: ['./properties-current-images.component.css'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class PropertiesCurrentImagesComponent implements OnInit {
  readonly images = input.required<string[]>();
  readonly id = input.required<string>();
  public delete = output<string[]>();

  public slideOpts = {
    initialSlide: 0,
    speed: 400,
    spaceBetween: 15,
    freeMode: true,
    slidesPerView: 'auto',
  };
  public selectedImages: string[] = [];

  constructor(
    private propertyService: PropertiesService,
    private toastCtrl: ToastController,
    private restriction: RestrictionService
  ) {}

  ngOnInit() {}

  public getImage(image: string) {
    image = image || 'assets/images/no-image.jpeg';
    return `url(${image})`;
  }

  public setSelected(selected: string) {
    if (this.isSelected(selected)) {
      this.selectedImages = this.selectedImages.filter(
        (img) => img !== selected
      );
      return;
    }
    this.selectedImages.push(selected);
  }

  public isSelected(image: string) {
    return this.selectedImages.includes(image);
  }

  public async deleteSelected() {
    if (this.restriction.restricted) {
      return this.restriction.showAlert();
    }

    try {
      const res = await this.propertyService.deletePropertyImage(
        this.selectedImages,
        this.id(),
      );

      if (res.data?.length) {
        const toast = await this.toastCtrl.create({
          message: res.message || 'Success: Image deleted',
          duration: 3000,
          color: 'success',
        });
        toast.present();
        this.delete.emit(res.data);
      }
    } catch (error) {
      console.error('Deleting property images failed:', error);
      const toast = await this.toastCtrl.create({
        message: 'Unable to delete images. Please try again.',
        duration: 3000,
        color: 'danger',
      });
      toast.present();
    }
  }
}
