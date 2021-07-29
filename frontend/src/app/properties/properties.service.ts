import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Property } from '../shared/interface/property';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {
  // private properties: Property[] = [];

  readonly $properties = new BehaviorSubject<Property[]>([]);

  constructor() { }

  public get properties(): Property[] {
    return this.$properties.getValue();
  }

  public set properties(property: Property[]) {
    this.$properties.next(property);
  }

  public _properties() {
    return this.$properties.asObservable();
  }

  public addProperty(property: Property) {
    this.properties = [...this.properties, property];
  }
}
