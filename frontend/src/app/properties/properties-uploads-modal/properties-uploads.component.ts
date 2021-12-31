import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Property } from 'src/app/shared/interface/property';
import { PropertiesService } from '../properties.service';

@Component({
  selector: 'app-properties-uploads',
  templateUrl: './properties-uploads.component.html',
  styleUrls: ['./properties-uploads.component.scss'],
})
export class PropertiesUploadsComponent implements OnInit {
  @Input() property: Property;
  public preview = '../../../assets/images/no-image.jpeg';
  private selectedFiles: FileList;
  constructor(
    private modalCtrl: ModalController,
    private propertiesService: PropertiesService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {}

  public dismissModal() {
    this.modalCtrl.dismiss();
  }

  public onSelectFile(event: Event) {
    const target = (event.target as HTMLInputElement);
    const files = target.files as FileList;
    if (files) {
      this.selectedFiles = files;
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (e: any) => {
        this.preview = e.target.result;
      };
    }
  }

  public async upload() {
    const res = await this.propertiesService
      .addPropertyImage(this.selectedFiles, this.property.property_id);

    if (res.images.length) {
      const toast = this.toastCtrl.create({
        message: res.message,
        color: 'success',
        duration: 2500
      });
      this.property.images = res.images;
      this.propertiesService.updateProperty(this.property);
      (await toast).present();
      this.modalCtrl.dismiss();
    }
  }
}
