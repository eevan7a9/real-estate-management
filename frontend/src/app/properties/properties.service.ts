import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../shared/interface/api-response';
// import { properties as dummyData } from '../shared/dummy-data';
import {
  Property,
  PropertyEditForm,
  PropertyCreateForm,
  PropertyMap,
  PropertyPage,
} from '../shared/interface/property';
import { UserService } from '../user/user.service';
import { requestOptions } from '../shared/utility/requests';
import { Params } from '@angular/router';

const propertyUrl = environment.api.server + 'properties';

@Injectable({
  providedIn: 'root',
})
export class PropertiesService {
  public isLoading = signal(false);
  public error = signal<string | null>(null);
  public hasMore = signal(true);
  public last = signal<{
    createdAt?: string;
    price?: string;
    name?: string;
    _id?: string;
  }>({
    createdAt: '',
    price: '',
    name: '',
    _id: '',
  });

  public readonly properties$: Observable<Property[] | undefined>;
  public readonly propertiesMap$: Observable<PropertyMap[] | undefined>;
  public readonly propertiesOwned$: Observable<Property[] | undefined>;

  private propertiesSub = new BehaviorSubject<Property[] | undefined>(
    undefined,
  );
  private propertiesMapSub = new BehaviorSubject<PropertyMap[] | undefined>(
    undefined,
  );
  private propertiesOwnedSub = new BehaviorSubject<Property[] | undefined>(
    undefined,
  );

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {
    this.propertiesMap$ = this.propertiesMapSub.asObservable();
    this.properties$ = this.propertiesSub.asObservable();
    this.propertiesOwned$ = this.propertiesOwnedSub.asObservable();
  }

  public get properties(): Property[] {
    return this.propertiesSub.getValue() || [];
  }

  public set properties(property: Property[]) {
    this.propertiesSub.next(property);
  }

  public get propertiesMap(): PropertyMap[] {
    return this.propertiesMapSub.getValue() || [];
  }

  public set propertiesMap(property: PropertyMap[]) {
    this.propertiesMapSub.next(property);
  }

  public get propertiesOwned(): Property[] | undefined {
    return this.propertiesOwnedSub.getValue();
  }

  public set propertiesOwned(property: Property[]) {
    this.propertiesOwnedSub.next(property);
  }

  public fetchProperties(
    params: string,
  ): Observable<ApiResponse<PropertyPage>> {
    const newUrl = propertyUrl + '?' + params;
    return this.http.get<ApiResponse<PropertyPage>>(newUrl);
  }

  public fetchMapProperties(): Observable<ApiResponse<PropertyMap[]>> {
    const url = `${propertyUrl}/map`;
    return this.http.get<ApiResponse<PropertyMap[]>>(url);
  }

  public fetchProperty(
    id: string,
    params?: URLSearchParams,
  ): Observable<ApiResponse<Property>> {
    const newUrl = `${propertyUrl}/${id}?${params?.toString() || ''}`;
    return this.http.get<ApiResponse<Property>>(newUrl);
  }

  public addProperty(
    property: PropertyCreateForm,
  ): Observable<ApiResponse<Property>> {
    const token = this.userService.token;

    return this.http.post<ApiResponse<Property>>(
      propertyUrl,
      property,
      requestOptions({ token }),
    );
  }

  public addPropertyImage(
    files: File[],
    id: string,
  ): Observable<ApiResponse<string[]>> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file, file.name);
    });

    const token = this.userService.token;
    return this.http.post<ApiResponse<string[]>>(
      propertyUrl + '/upload/images/' + id,
      formData,
      requestOptions({ token, contentType: '' }),
    );
  }

  public async deletePropertyImage(
    images: string[],
    propId: string,
  ): Promise<ApiResponse<string[]>> {
    const token = this.userService.token;
    const url = propertyUrl + '/upload/images/' + propId;

    return firstValueFrom(
      this.http.delete<ApiResponse<string[]>>(
        url,
        requestOptions({ token }, { images }),
      ),
    );
  }

  public removeProperty(propId: string): Observable<ApiResponse<Property>> {
    const token = this.userService.token;
    const url = `${propertyUrl}/${propId}`;
    return this.http.delete<ApiResponse<Property>>(
      url,
      requestOptions({ token }),
    );
  }

  public updateProperty(
    updated: PropertyEditForm,
  ): Observable<ApiResponse<Property>> {
    const url = `${propertyUrl}/${updated.property_id}`;
    const token = this.userService.token;
    return this.http.patch<ApiResponse<Property>>(
      url,
      updated,
      requestOptions({ token }),
    );
  }

  public fetchOwnedProperties(): Observable<ApiResponse<Property[]>> {
    return this.http.get<ApiResponse<Property[]>>(
      propertyUrl + '/me',
      requestOptions({ token: this.userService.token }),
    );
  }

  public addPropertyToState(property: Property) {
    this.properties = [...this.properties, property];
    this.propertiesMap = [...this.propertiesMap, property];
    if (this.propertiesOwned) {
      this.propertiesOwned = [...this.propertiesOwned, property];
    }
  }

  public removePropertyFromState(property_id: string) {
    this.properties = this.properties.filter(
      (property) => property.property_id !== property_id,
    );
    if (this.propertiesOwned) {
      this.propertiesOwned = this.propertiesOwned.filter(
        (property) => property.property_id !== property_id,
      );
    }
  }

  public updatePropertyInState(updated: Property): void {
    this.properties = this.properties.map((property) =>
      property.property_id === updated.property_id ? updated : property,
    );

    if (this.propertiesOwned) {
      this.propertiesOwned = this.propertiesOwned.map((property) =>
        property.property_id === updated.property_id ? updated : property,
      );
    }
  }

  public resetState(opts?: { skipOwned: boolean }): void {
    this.properties = [];
    this.error.set(null);
    if (!opts?.skipOwned) {
      this.propertiesOwned = [];
    }
  }

  public async loadMore(queryParams: Params | undefined): Promise<boolean> {
    if (!queryParams || this.isLoading() || !this.hasMore()) {
      return false;
    }

    this.error.set(null);

    try {
      this.isLoading.set(true);
      const params = this.buildPaginationParams(queryParams);
      const res = await firstValueFrom(this.fetchProperties(params));

      const items = res.data?.items ?? [];

      if (items.length) {
        this.properties = [...this.properties, ...items];
      }

      this.hasMore.set(Boolean(res.data?.hasMore));

      if (res.data?.hasMore) {
        this.last.set({
          createdAt: res.data.lastCreatedAt?.toString(),
          price: res.data.lastPrice?.toString(),
          name: res.data.lastName?.toString(),
          _id: res.data.last_id?.toString(),
        });
      }

      return true;
    } catch (error: unknown) {
      const message =
        error instanceof HttpErrorResponse
          ? error.error?.message || error.message
          : 'Unable to load properties. Please try again.';

      this.error.set(message || 'Unable to load properties. Please try again.');
      console.error('Loading properties failed:', error);
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  private buildPaginationParams(queryParams: Params | undefined) {
    if (!queryParams) return '';

    const { sort, filter, search } = queryParams;
    const last = this.last();

    const params = new URLSearchParams();

    params.append('limit', '8');
    params.append('sort', sort || 'latest');

    if (search) params.append('search', search);
    if (filter?.length) params.append('filter', filter);

    if (last.createdAt) params.append('lastCreatedAt', last.createdAt);

    if (last.price) params.append('lastPrice', last.price);

    if (last.name) params.append('lastName', last.name);

    if (last._id) params.append('last_id', last._id);

    return params.toString();
  }
}
