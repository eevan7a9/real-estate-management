import { Component, signal } from '@angular/core';
import { PropertyType } from '../shared/enums/property';
import { toSignal } from '@angular/core/rxjs-interop';
import { Property } from '../shared/interface/property';
import { PropertiesService } from '../properties/properties.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.css'],
  standalone: false,
})
export class MapPage {
  public properties = toSignal<Property[]>(this.propertiesService.properties$);
  public visibleType = signal<string[]>([
    PropertyType.residential.toString(),
    PropertyType.commercial.toString(),
    PropertyType.industrial.toString(),
    PropertyType.land.toString(),
  ]);

  constructor(private propertiesService: PropertiesService) {}

  setVisibleMarkerType(event: { type: string; isChecked: boolean }) {
    if (!event.isChecked) {
      this.visibleType.set(this.visibleType().filter((v) => v !== event.type));
    } else {
      this.visibleType.set([...this.visibleType(), event.type]);
    }
  }
}
