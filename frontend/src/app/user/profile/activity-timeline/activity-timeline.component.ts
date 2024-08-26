import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ActivitiesService } from 'src/app/activities/activities.service';
import { Activity } from 'src/app/shared/interface/activities';

@Component({
  selector: 'app-activity-timeline',
  templateUrl: './activity-timeline.component.html',
  styleUrls: ['./activity-timeline.component.scss'],
})
export class ActivityTimelineComponent implements OnInit, OnDestroy {
  public activities = signal<Activity[]>([]);
  private unSubscribe$ = new Subject<void>();

  constructor(private activitiesService: ActivitiesService, private router: Router) {}

  ngOnInit() {
    this.activitiesService.activities$
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe((events) => {
        this.activities.set(events);
      });
    
      if(!this.activities().length) {
        this.activitiesService.fetchActivities();
      }
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }

  public viewProperty(activity: Activity): void {
    if(activity.property_id) {
      this.router.navigate(['properties', activity.property_id])
    }
  }
}
