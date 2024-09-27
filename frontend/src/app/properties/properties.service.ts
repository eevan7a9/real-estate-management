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
  public readonly properties$: Observable<Property[]>;
  private readonly propertiesSub = new BehaviorSubject<Property[]>([]);
  private loading = signal(false);

  constructor(private http: HttpClient, private userService: UserService) {
    this.properties$ = this.propertiesSub.asObservable();
    this.fetchProperties().then((res) => {
      this.loading.set(true);
      if (res.status === 200) {
        this.properties = res.data;
      }
      this.loading.set(false);
    });
  }

  public isLoading = computed(() => this.loading());

  public get properties(): Property[] {
    return this.propertiesSub.getValue();
  }

  public set properties(property: Property[]) {
    this.propertiesSub.next(property);
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
      return res
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
}
