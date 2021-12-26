import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-property-gallery',
  templateUrl: './property-gallery.component.html',
  styleUrls: ['./property-gallery.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PropertyGalleryComponent implements OnInit {
  @Input() images: string[] = [];
  public imagePresented = 'assets/images/no-image.jpeg';
  public slideOpts: SwiperOptions = {
    initialSlide: 0,
    speed: 400,
    spaceBetween: 15,
    freeMode: true,
    slidesPerView: 'auto',
  };
  constructor() {}

  ngOnInit() {
    if (this.images?.length) {
      this.imagePresented = this.images[0];
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
