import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { properties as dummyData } from '../shared/dummy-data';
import { Property } from '../shared/interface/property';
import { headerDict } from '../shared/utility';

const propertyUrl = environment.api.url+'properties';
const requestOptions = {
  headers: new HttpHeaders(headerDict),
};

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {

  public readonly properties$: Observable<Property[]>;
  public readonly property$: Observable<Property>;
  private readonly propertiesSub = new BehaviorSubject<Property[]>([]);
  private readonly propertySub = new BehaviorSubject<Property>(null);

  constructor(private http: HttpClient) {
    this.properties$ = this.propertiesSub.asObservable();
    this.property$ = this.propertySub.asObservable();
    this.fetchProperties();
  }

  public get properties(): Property[] {
    return this.propertiesSub.getValue();
  }

  public set properties(property: Property[]) {
    this.propertiesSub.next(property);
  }


  public get property(): Property | null {
    return this.propertySub.getValue();
  }

  public set property(property: Property) {
    this.propertySub.next(property);
  }

  public async fetchProperties(): Promise<void> {
    try {
      this.properties = await this.http.get<Property[]>(propertyUrl).toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  public async addProperty(property: Property) {
    try {
      const newProperty = await this.http.post<Property>(propertyUrl, property, requestOptions)
        .toPromise();
      this.properties = [...this.properties, newProperty];
      return newProperty;
    } catch (error) {
      console.log(error);
    }
  }

  public async addPropertyImage(files: File[], id: string) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file, file.name);
    });
    try {
      return await this.http
        .post<any>(propertyUrl + '/upload/images/' + id, formData)
        .toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  public removeProperty(propId: string) {
    const properties = this.properties.filter(property => property.property_id !== propId);
    this.properties = properties;
  }

  public updateProperty(updated: Property) {
    let findProperty = this.properties.find((property: Property) => property.property_id === updated.property_id);
    findProperty = { ...findProperty, ...updated };

    this.properties = this.properties.map(property => (property.property_id === updated.property_id) ?
      findProperty : property);
    this.property = findProperty;
  }
}
