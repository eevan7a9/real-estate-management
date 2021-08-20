import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Property } from 'src/app/shared/interface/property';
import { PropertiesService } from '../properties.service';

@Component({
  selector: 'app-properties-list',
  templateUrl: './properties-list.component.html',
  styleUrls: ['./properties-list.component.scss'],
})
export class PropertiesListComponent implements OnInit, OnDestroy {
  @Input() singleCol = false;
  @Input() horizontalSlide = false;
  @Input() limit = 0;
  public properties: Property[];
  private unsubscribe$ = new Subject<void>();

  constructor(
    private propertiesService: PropertiesService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.propertiesService.properties$.pipe(takeUntil(this.unsubscribe$)).subscribe(v => {
      this.properties = this.limit ? v.slice(0, this.limit) : v;
    });
    this.changeDetector.detectChanges();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public selectProperty(property: Property) {
    this.propertiesService.property = property;
    this.router.navigate(['/properties', property.id]);
  }
}
