import { Component, OnDestroy, OnInit, signal } from '@angular/core';
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

  constructor(private activitiesService: ActivitiesService) {}

  ngOnInit() {
    this.activitiesService.activities$
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe((events) => {
        this.activities.set(events);
      });
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }
}
