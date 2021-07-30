import { Component, HostListener, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-property-gallery',
  templateUrl: './property-gallery.component.html',
  styleUrls: ['./property-gallery.component.scss'],
})
export class PropertyGalleryComponent implements OnInit {
  public imagePresented = 'assets/images/no-image.jpeg';
  public slideOpts = {
    initialSlide: 0,
    speed: 400,
    spaceBetween: 25,
    freeMode: true,
    freeModeSticky: false,
    slidesPerView: 'auto',
  };
  public images = [
    { src: 'https://cdn.pixabay.com/photo/2016/11/18/17/20/living-room-1835923__340.jpg' },
    { src: 'https://cdn.pixabay.com/photo/2017/07/30/23/59/garlic-2556022__340.jpg' },
    { src: 'https://cdn.pixabay.com/photo/2015/03/26/09/42/bedroom-690129__340.jpg' },
    { src: '' },
    { src: '' },
  ];

  constructor() { }

  ngOnInit() {
    if (this.images[0].src) {
      this.imagePresented = this.images[0].src;
    }
  }

  public getImage(image: string) {
    image = image || 'assets/images/no-image.jpeg';
    return `url(${image})`;
  }

  public setSelected(image: string) {
    this.imagePresented = image || 'assets/images/no-image.jpeg';
  }
}
