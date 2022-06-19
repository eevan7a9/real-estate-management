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
  public previews = [];
  public selectedFiles: File[];

  constructor(
    private modalCtrl: ModalController,
    private propertiesService: PropertiesService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() { }

  public dismissModal() {
    this.modalCtrl.dismiss();
  }

  public async onSelectFile(event: Event) {
    const target = (event.target as HTMLInputElement);
    const files = target.files as FileList;
    if (files) {
      // We set preview images
      this.selectedFiles = Array.from(files);
      for (const file of this.selectedFiles) {
        const img = await this.getPreviewImage(file);
        this.previews.push(img);
      }
      // Scroll into upload button
      const uploadBtn = document.querySelector('#uploadBtn');
      setTimeout(() => {
        uploadBtn.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }

  public async upload() {
    if (!this.selectedFiles) {
      return this.presentToast('Please, select images to upload.', 300, 'danger');
    }
    const res = await this.propertiesService
      .addPropertyImage(this.selectedFiles, this.property.property_id);
    if (!res || res.status !== 201) {
      const msg = 'Error: Something went wrong, please try again later.';
      this.presentToast(`Error: ${res.message || msg}`, 3000, 'danger');
      this.modalCtrl.dismiss();
      return;
    }
    this.property.images = res.data;
    this.propertiesService.updateProperty(this.property);
    this.presentToast(res.message || 'Success: Image uploaded');
    this.modalCtrl.dismiss();
  }

  public removeFile(index: number) {
    this.previews.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  private async getPreviewImage(file: File) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = (e: any) => {
        resolve(e.target.result);
      };
      fr.onerror = e => {
        reject(e);
      };
      fr.readAsDataURL(file);
    });
  }

  private async presentToast(message: string, duration = 3000, color = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      color
    });
    toast.present();
  }
}
