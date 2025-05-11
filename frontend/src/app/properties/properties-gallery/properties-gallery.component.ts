import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
@Component({
    selector: 'app-properties-gallery',
    templateUrl: './properties-gallery.component.html',
    styleUrls: ['./properties-gallery.component.css'],
    standalone: false
})
export class PropertiesGalleryComponent implements OnInit {
  readonly images = input<string[]>();
  readonly showEdit = input<boolean>(false);
  @Output() edit = new EventEmitter<boolean>();

  public imagePresented = 'assets/images/no-image.jpeg';

  constructor() { }

  ngOnInit() {
    this.setImage();
  }

  public setSelected(image: string) {
    this.imagePresented = image || 'assets/images/no-image.jpeg';
  }

  public setImage() {
    this.imagePresented = this.images()[0] || 'assets/images/no-image.jpeg';
  }
}
