import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Property } from '../shared/interface/property';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {
  public readonly properties$: Observable<Property[]>;
  private readonly propertiesSub = new BehaviorSubject<Property[]>([]);

  constructor() {
    this.properties$ = this.propertiesSub.asObservable();
  }

  public get properties(): Property[] {
    return this.propertiesSub.getValue();
  }

  public set properties(property: Property[]) {
    this.propertiesSub.next(property);
  }

  public addProperty(property: Property) {
    this.properties = [...this.properties, property];
  }
}
