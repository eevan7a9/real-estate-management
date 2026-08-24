import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { Property } from '../shared/interface/property';
import { PropertiesService } from '../properties/properties.service';
import { UserService } from '../user/user.service';

@Injectable({ providedIn: 'root' })
export class ManagementService {
  public readonly properties$: Observable<Property[] | undefined>;
  public readonly isLoading = signal(false);
  public readonly error = signal<string | null>(null);
  private loadedForToken = '';

  constructor(
    private propertiesService: PropertiesService,
    private userService: UserService
  ) {
    this.properties$ = this.propertiesService.propertiesOwned$;
  }

  public async loadProperties(force = false): Promise<void> {
    const token = this.userService.token;
    if (!token) {
      this.error.set('Sign in to manage your properties.');
      return;
    }
    if (
      !force &&
      this.loadedForToken === token &&
      this.propertiesService.propertiesOwned
    )
      return;
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const response = await firstValueFrom(
        this.propertiesService.fetchOwnedProperties()
      );
      if (response.status === 200) {
        this.propertiesService.propertiesOwned = response.data || [];
        this.loadedForToken = token;
      }
    } catch (error: unknown) {
      const message =
        error instanceof HttpErrorResponse
          ? error.error?.message || error.message
          : 'Unable to load your properties. Please try again.';
      this.error.set(message || 'Unable to load your properties.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
