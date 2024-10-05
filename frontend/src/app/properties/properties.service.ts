import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../shared/interface/api-response';
// import { properties as dummyData } from '../shared/dummy-data';
import { Property } from '../shared/interface/property';
import { UserService } from '../user/user.service';
import { requestOptions } from '../shared/utility/requests';

const propertyUrl = environment.api.server + 'properties';

@Injectable({
  providedIn: 'root',
})
export class PropertiesService {
  public isLoading = signal(false);
  public readonly properties$: Observable<Property[] | undefined>;
  public readonly propertiesOwned$: Observable<Property[] | undefined>;

  private propertiesSub = new BehaviorSubject<Property[] | undefined>(undefined);
  private propertiesOwnedSub = new BehaviorSubject<Property[] | undefined>(undefined);

  constructor(private http: HttpClient, private userService: UserService) {
    this.properties$ = this.propertiesSub.asObservable();
    this.propertiesOwned$ = this.propertiesOwnedSub.asObservable();

    this.fetchProperties().then((res) => {
      this.isLoading.set(true);
      if (res.status === 200) {
        this.properties = res.data;
      }
      this.isLoading.set(false);
    });
  }

  public get properties(): Property[] | undefined {
    return this.propertiesSub.getValue();
  }

  public set properties(property: Property[]) {
    this.propertiesSub.next(property);
  }

  public get propertiesOwned(): Property[] | undefined {
    return this.propertiesOwnedSub.getValue();
  }

  public set propertiesOwned(property: Property[]) {
    this.propertiesOwnedSub.next(property);
  }

  public async fetchProperties(): Promise<ApiResponse<Property[]>> {
    try {
      const res = await firstValueFrom(
        this.http.get<ApiResponse<Property[]>>(propertyUrl)
      );
      return res;
    } catch (error) {
      console.error(error);
      return error?.error || error;
    }
  }

  public async fetchProperty(id: string): Promise<ApiResponse<Property>> {
    try {
      const res = await firstValueFrom(
        this.http.get<ApiResponse<Property>>(propertyUrl + '/' + id)
      );
      return res;
    } catch (error) {
      console.error(error);
      return error?.error || error;
    }
  }

  public async addProperty(property: Property): Promise<ApiResponse<Property>> {
    const token = this.userService.token;
    try {
      const res = await firstValueFrom(
        this.http.post<ApiResponse<Property>>(
          propertyUrl,
          property,
          requestOptions({ token })
        )
      );
      return res;
    } catch (error) {
      console.error(error);
      return error.error;
    }
  }

  public async addPropertyImage(
    files: File[],
    id: string
  ): Promise<ApiResponse<string[]>> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file, file.name);
    });
    try {
      const token = this.userService.token;
      return await firstValueFrom(
        this.http.post<ApiResponse<string[]>>(
          propertyUrl + '/upload/images/' + id,
          formData,
          requestOptions({ token, contentType: null })
        )
      );
    } catch (error) {
      console.error(error);
      return error.error || error;
    }
  }

  public async deletePropertyImage(
    images: string[],
    propId: string
  ): Promise<ApiResponse<string[]>> {
    const token = this.userService.token;
    try {
      const url = `${propertyUrl}/upload/images/${propId}`;
      const res = await firstValueFrom(
        this.http.delete<ApiResponse<string[]>>(
          url,
          requestOptions({ token }, { images })
        )
      );
      return res;
    } catch (error) {
      console.error(error);
    }
  }

  public async removeProperty(propId: string): Promise<ApiResponse<Property>> {
    const token = this.userService.token;
    try {
      const url = `${propertyUrl}/${propId}`;
      const res = await firstValueFrom(
        this.http.delete<ApiResponse<Property>>(url, requestOptions({ token }))
      );
      return res;
    } catch (error) {
      console.error(error);
    }
  }

  public async updateProperty(
    updated: Property
  ): Promise<ApiResponse<Property>> {
    const url = `${propertyUrl}/${updated.property_id}`;
    try {
      const token = this.userService.token;
      const res = await firstValueFrom(
        this.http.patch<ApiResponse<Property>>(
          url,
          updated,
          requestOptions({ token })
        )
      );
      return res;
    } catch (error) {
      console.error(error);
      return error.error || error;
    }
  }

  public async getOwnedProperties(): Promise<ApiResponse<Property[]>> {
    try {
      const res = await firstValueFrom(
        this.http.get<ApiResponse<Property[]>>(
          propertyUrl + '/me',
          requestOptions({ token: this.userService.token })
        )
      );
      return res;
    } catch (error) {
      console.log(error);
      return error.error || error;
    }
  }

  public addPropertyToState(property: Property) {
    this.properties = [...this.properties, property];
    this.propertiesOwned = [...this.propertiesOwned, property];
  }

  public removePropertyFromState(property_id: string) {
    this.properties = this.properties.filter(
      (property) => property.property_id !== property_id
    );
    this.propertiesOwned = this.propertiesOwned.filter(
      (property) => property.property_id !== property_id
    );
  }
}
