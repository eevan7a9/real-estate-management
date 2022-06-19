import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../shared/interface/api-response';
// import { properties as dummyData } from '../shared/dummy-data';
import { Property } from '../shared/interface/property';
import { headerDict } from '../shared/utility';
import { UserService } from '../user/user.service';

const propertyUrl = environment.api.url + 'properties';
const requestOptions = ({ token = '', contentType = 'application/json' }, body = {}) => ({
  headers: new HttpHeaders(headerDict({ token, contentType })),
  body
});

interface ResProperty extends ApiResponse {
  data: Property;
}

interface ResProperties extends ApiResponse {
  data: Property[];
}

interface ResStrings extends ApiResponse {
  data: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {

  public readonly properties$: Observable<Property[]>;
  public readonly property$: Observable<Property>;
  private readonly propertiesSub = new BehaviorSubject<Property[]>([]);
  private readonly propertySub = new BehaviorSubject<Property>(null);

  constructor(private http: HttpClient, private userService: UserService) {
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
      this.properties = (await this.http.get<ResProperties>(propertyUrl).toPromise()).data;
    } catch (error) {
      console.error(error);
    }
  }

  public async addProperty(property: Property): Promise<ResProperty> {
    const token = this.userService.token();
    try {
      const res = await this.http.post<ResProperty>(propertyUrl, property, requestOptions({ token }))
        .toPromise();
      this.properties = [...this.properties, res.data];
      return res;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  public async addPropertyImage(files: File[], id: string): Promise<ResStrings> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file, file.name);
    });
    try {
      const token = this.userService.token();
      return await this.http.post<ResStrings>(
        propertyUrl + '/upload/images/' + id,
        formData,
        requestOptions({ token, contentType: null })
      ).toPromise();
    } catch (error) {
      console.error(error);
      return error.error || error;
    }
  }

  public async deletePropertyImage(images: string[], propId: string): Promise<ResStrings> {
    const token = this.userService.token();
    try {
      const url = `${propertyUrl}/upload/images/${propId}`;
      const res = await this.http.delete<ResStrings>(url, requestOptions({ token }, { images })).toPromise();
      this.property.images = this.property.images.filter(img => !res.data.includes(img));
      return res;
    } catch (error) {
      console.error(error);
    }
  }

  public async removeProperty(propId: string): Promise<void> {
    try {
      const url = `${propertyUrl}/${propId}`;
      const res = await this.http.delete<ResProperty>(url).toPromise();
      this.properties = this.properties.filter(property => property.property_id !== res.data.property_id);
    } catch (error) {
      console.error(error);
    }
  }

  public async updateProperty(updated: Property): Promise<ResProperty> {
    const url = `${propertyUrl}/${updated.property_id}`;
    try {
      const token = this.userService.token();
      const res = await this.http.patch<ResProperty>(url, updated, requestOptions({ token })).toPromise();
      // UPDATE CURRENT PROPERTIES
      this.properties = this.properties.map(property =>
        (property.property_id === updated.property_id) ? res.data : property);
      this.property = res.data;

      return res;
    } catch (error) {
      console.error(error);
      return error.error || error;
    }

  }
}
