import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { Activity } from '../shared/interface/activities';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../shared/interface/api-response';
import { HttpClient } from '@angular/common/http';
import { requestOptions } from '../shared/utility/requests';
import { UserService } from '../user/user.service';

const propertyUrl = environment.api.server + 'activities';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesService {
  public loading = signal(false);
  public activities$: Observable<Activity[]>;
  private activitiesSub = new BehaviorSubject<Activity[]>([]);

  constructor(private http: HttpClient, private user: UserService) {
    this.activities$ = this.activitiesSub.asObservable();
  }

  public get activities(): Activity[] {
    return this.activitiesSub.value;
  }

  public set activities(activities: Activity[]) {
    this.activitiesSub.next(activities);
  }

  public async fetchActivities(): Promise<ApiResponse<Activity[]>> {
    try {
      this.loading.set(true);
      const res = await firstValueFrom(
        this.http.get<ApiResponse<Activity[]>>(
          propertyUrl,
          requestOptions({ token: this.user.token })
        )
      );
      this.activities = res.data;
      return res;
    } catch (error) {
      console.error(error);
    } finally {
      this.loading.set(false);
    }
  }

  public insertActivities(activity: Activity): void {
    this.activities = [activity, ...this.activities];
  }

  public resetState(): void {
    this.activities = [];
    this.loading.set(false);
  }
}
