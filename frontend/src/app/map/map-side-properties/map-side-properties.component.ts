import { Component, computed, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PropertiesService } from 'src/app/properties/properties.service';
import { Property } from 'src/app/shared/interface/property';

@Component({
  selector: 'app-map-side-properties',
  templateUrl: './map-side-properties.component.html',
  styleUrls: ['./map-side-properties.component.css'],
  standalone: false,
})
export class MapSidePropertiesComponent implements OnInit {
  private propertiesService = inject(PropertiesService);
  private properties = toSignal(this.propertiesService.properties$);
  public propertiesList = computed<Property[]>(() => this.properties()?.slice(0, 10) ?? []);

  constructor() { }

  ngOnInit() {
    console.log('Loading properties from map-side-properties component',
      this.propertiesService.properties.length
    );
    if (!this.propertiesService.properties.length) {
      console.log('Loading properties from map-side-properties component');
      this.propertiesService.loadMore({});
    }
  }

}
