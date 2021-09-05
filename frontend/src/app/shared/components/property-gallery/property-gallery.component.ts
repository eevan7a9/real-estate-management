import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-property-gallery',
  templateUrl: './property-gallery.component.html',
  styleUrls: ['./property-gallery.component.scss'],
})
export class PropertyGalleryComponent implements OnInit {
  @Input() images: { src: string }[] = [];
  public imagePresented = 'assets/images/no-image.jpeg';
  public slideOpts = {
    initialSlide: 0,
    speed: 400,
    spaceBetween: 25,
    freeMode: true,
    freeModeSticky: false,
    slidesPerView: 'auto',
  };
  constructor() { }

  ngOnInit() {
    if (this.images?.length) {
      console.log(this.images, 'has images');
      this.imagePresented = this.images[0].src;
    } else {
      console.log('no images');
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
