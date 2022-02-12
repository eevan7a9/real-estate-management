import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../shared/interface/api-response';
// import { properties as dummyData } from '../shared/dummy-data';
import { Property } from '../shared/interface/property';
import { headerDict } from '../shared/utility';

const propertyUrl = environment.api.url + 'properties';
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
      this.properties = (await this.http.get<ApiResponse & { data: Property[] }>(propertyUrl).toPromise()).data;
    } catch (error) {
      console.error(error);
    }
  }

  public async addProperty(property: Property) {
    try {
      const res = await this.http.post<ApiResponse & { data: Property }>(propertyUrl, property, requestOptions)
        .toPromise();
      this.properties = [...this.properties, res.data];
      return res;
    } catch (error) {
      console.error(error);
    }
  }

  public async addPropertyImage(files: File[], id: string) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file, file.name);
    });
    try {
      return await this.http
        .post<ApiResponse & { data: string[] }>(propertyUrl + '/upload/images/' + id, formData)
        .toPromise();
    } catch (error) {
      console.error(error);
    }
  }

  public async removeProperty(propId: string) {
    try {
      const res = await this.http.delete<ApiResponse & { data: Property }>(`${propertyUrl}/${propId}`).toPromise();
      this.properties = this.properties.filter(property => property.property_id !== res.data.property_id);
    } catch (error) {
      console.error(error);
    }
  }

  public async updateProperty(updated: Property): Promise<ApiResponse & { data: Property }> {
    try {
      const res = await this.http.patch<ApiResponse & { data: Property }>
        (`${propertyUrl}/${updated.property_id}`, updated, requestOptions).toPromise();

      if (res.status !== 200 && res.status !== 201) {
        return;
      }
      // UPDATE CURRENT PROPERTIES
      this.properties = this.properties.map(property =>
        (property.property_id === updated.property_id) ? res.data : property);
      this.property = res.data;

      return res;
    } catch (error) {
      console.error(error);
    }

  }
}
