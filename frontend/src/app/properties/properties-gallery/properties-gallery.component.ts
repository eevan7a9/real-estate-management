import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-properties-gallery',
  templateUrl: './properties-gallery.component.html',
  styleUrls: ['./properties-gallery.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PropertiesGalleryComponent implements OnInit {
  @Input() images: string[] = [];
  @Input() showEdit = false;
  @Output() edit = new EventEmitter<boolean>();
  public imagePresented = 'assets/images/no-image.jpeg';
  public slideOpts: SwiperOptions = {
    initialSlide: 0,
    speed: 400,
    spaceBetween: 15,
    freeMode: true,
    slidesPerView: 'auto',
  };

  constructor() { }

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
