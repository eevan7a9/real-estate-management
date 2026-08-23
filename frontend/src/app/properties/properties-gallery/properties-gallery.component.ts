import { Component, effect, EventEmitter, input, Output } from '@angular/core';
@Component({
  selector: 'app-properties-gallery',
  templateUrl: './properties-gallery.component.html',
  styleUrls: ['./properties-gallery.component.css'],
  standalone: false
})
export class PropertiesGalleryComponent {
  readonly images = input<string[]>();
  readonly showEdit = input<boolean>(false);
  readonly altText = input<string>('Property image');
  @Output() edit = new EventEmitter<boolean>();

  public imagePresented = 'assets/images/no-image.jpeg';

  constructor() {
    effect(() => this.setImage());
  }

  public setSelected(image: string) {
    this.imagePresented = image || 'assets/images/no-image.jpeg';
  }

  public setImage() {
    this.imagePresented = this.images()?.[0] || 'assets/images/no-image.jpeg';
  }
}
