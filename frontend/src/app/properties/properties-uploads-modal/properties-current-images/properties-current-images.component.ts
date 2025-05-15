import {
  Component,
  EventEmitter,
  Input,
  OnInit,
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
  @Input() images: string[] = [];
  @Input() id: string;
  @Output() delete = new EventEmitter<string[]>();

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
    if(this.restriction.restricted) {
      return this.restriction.showAlert();
    }
    const { data, message } = await this.propertyService.deletePropertyImage(
      this.selectedImages,
      this.id
    );
    if (data.length) {
      const toast = await this.toastCtrl.create({
        message,
        duration: 3000,
        color: 'success',
      });
      toast.present();
      this.delete.emit(data);
    }
  }
}
