import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PropertiesService } from '../properties.service';

@Component({
  selector: 'app-properties-uploads',
  templateUrl: './properties-uploads.component.html',
  styleUrls: ['./properties-uploads.component.scss'],
})
export class PropertiesUploadsComponent implements OnInit {
  public preview = '../../../assets/images/no-image.jpeg';
  private selectedFiles: FileList;
  constructor(private modalCtrl: ModalController, private propertiesService: PropertiesService) { }

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
    const res = await this.propertiesService.addPropertyImage(
      this.selectedFiles, '2a5fd074-3846-49af-8611-9ee81cfa878c'
    );
    console.log(res);
  }
}
