import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ActivitiesService } from 'src/app/activities/activities.service';
import { ActivityType } from 'src/app/shared/enums/activity';
import { Activity } from 'src/app/shared/interface/activities';

@Component({
    selector: 'app-activity-timeline',
    templateUrl: './activity-timeline.component.html',
    styleUrls: ['./activity-timeline.component.css'],
    standalone: false
})
export class ActivityTimelineComponent {
  public actionType = ActivityType;
  public activities = toSignal<Activity[]>(this.activitiesService.activities$);

  constructor(
    private activitiesService: ActivitiesService,
    private router: Router
  ) {}

  public viewProperty(activity: Activity): void {
    if (activity.property_id) {
      this.router.navigate(['properties', activity.property_id]);
    }
  }

  public viewEnquiry(activity: Activity): void {
    if (activity.enquiry_id) {
      this.router.navigate(['enquiries', activity.enquiry_id]);
    }
  }
}
