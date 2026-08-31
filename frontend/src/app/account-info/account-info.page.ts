import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import {
  PublicProfileLinks,
  PublicUserProfile
} from '@app/shared/interface/user';
import { UserService } from '@app/user/user.service';

interface SocialProfileLink {
  label: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.page.html',
  styleUrls: ['./account-info.page.css'],
  standalone: false
})
export class AccountInfoPage implements OnInit, OnDestroy {
  public readonly defaultProfileImage = 'assets/images/avatar.png';
  public profile = signal<PublicUserProfile | undefined>(undefined);
  public ready = signal(false);
  public loadError = signal<string | null>(null);
  public readonly location = computed(() => {
    const location = this.profile()?.publicLocation;
    return [location?.city, location?.region, location?.country]
      .filter(Boolean)
      .join(', ');
  });
  public readonly socialLinks = computed<SocialProfileLink[]>(() => {
    const links = this.profile()?.links;

    const definitions: Array<{
      key: keyof PublicProfileLinks;
      label: string;
      icon: string;
    }> = [
      { key: 'website', label: 'Website', icon: 'globe-outline' },
      { key: 'facebook', label: 'Facebook', icon: 'logo-facebook' },
      { key: 'instagram', label: 'Instagram', icon: 'logo-instagram' },
      { key: 'linkedin', label: 'LinkedIn', icon: 'logo-linkedin' },
      { key: 'x', label: 'X', icon: 'logo-x' },
      { key: 'youtube', label: 'YouTube', icon: 'logo-youtube' },
      { key: 'tiktok', label: 'TikTok', icon: 'logo-tiktok' }
    ];

    return definitions.map(({ key, label, icon }) => ({
      label,
      url: links?.[key]?.trim() || '',
      icon
    }));
  });
  private routeSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      const userId = params.get('id');
      if (!userId) {
        this.profile.set(undefined);
        this.loadError.set('A profile ID is required.');
        this.ready.set(true);
        return;
      }
      void this.loadProfile(userId);
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  public roleLabel(role?: PublicUserProfile['role']): string {
    return role
      ? role.charAt(0).toUpperCase() + role.slice(1)
      : 'Property owner';
  }

  public retryLoad(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) void this.loadProfile(userId);
  }

  private async loadProfile(userId: string): Promise<void> {
    this.ready.set(false);
    this.loadError.set(null);
    this.profile.set(undefined);
    try {
      const response = await firstValueFrom(
        this.userService.getPublicProfile(userId)
      );
      if (response.status !== 200 || !response.data) {
        throw new Error(
          response.message || 'Unable to load this public profile.'
        );
      }
      this.profile.set(response.data);
    } catch (error: unknown) {
      const message =
        error instanceof HttpErrorResponse
          ? error.error?.message || error.message
          : error instanceof Error
            ? error.message
            : 'Unable to load this public profile.';
      this.loadError.set(message);
    } finally {
      this.ready.set(true);
    }
  }
}
