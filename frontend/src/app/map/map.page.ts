import { Component } from '@angular/core';
import { PropertyType } from '../shared/enums/property';
import { toSignal } from '@angular/core/rxjs-interop';
import { Property } from '../shared/interface/property';
import { PropertiesService } from '../properties/properties.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {
  public properties = toSignal<Property[]>(this.propertiesService.properties$);
  public visibleType = [
    PropertyType.residential.toString(),
    PropertyType.commercial.toString(),
    PropertyType.industrial.toString(),
    PropertyType.land.toString()
  ];

  constructor(private propertiesService: PropertiesService) { }

  setVisibleMarkerType(event: { type: string; isChecked: boolean }) {
    if (!event.isChecked) {
      this.visibleType = this.visibleType.filter(v => v !== event.type);
    } else {
      this.visibleType = [...this.visibleType, event.type];
    }
  }
}
