import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Property } from 'src/app/shared/interface/property';
import { sortListByDate, sortListByName, sortListByNumber } from 'src/app/shared/utility';
import { PropertiesService } from '../properties.service';
import { PropertyType } from 'src/app/shared/enums/property';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-properties-list',
  templateUrl: './properties-list.component.html',
  styleUrls: ['./properties-list.component.scss'],
})
export class PropertiesListComponent implements OnInit, OnDestroy {
  @ViewChild('IonInfiniteScroll', { static: false }) infinityScroll: IonInfiniteScroll;

  @Input() singleCol = false;
  @Input() horizontalSlide = false;
  @Input() limit = 0;
  @Output() isLoading = new EventEmitter<boolean>();

  public properties: Property[];
  public displayedItems: Property[] = [];
  public maxDisplayed = 8;

  private filterBy: PropertyType[] = [];
  private sortBy = 'latest';
  private ownedPropertiesOnly = false;
  private searchText = '';
  private unsubscribe$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private propertiesService: PropertiesService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getProperties();
  }

  ngOnDestroy() {
    this.unSubscribed();
  }

  public loadData() {
    this.maxDisplayed = this.maxDisplayed + 4;
    setTimeout(() => {
      this.displayedItems = this.properties.slice(0, this.maxDisplayed);
      this.infinityScroll.complete();
    }, 1500);
  }

  public setFilters(filters: PropertyType[]) {
    this.filterBy = filters;
    this.getProperties();
  }

  public setOwnedPropertiesOnly(val: boolean) {
    this.ownedPropertiesOnly = val;
    this.getProperties();
  }

  public setSort(sort: string) {
    this.sortBy = sort;
    this.getProperties();
  }

  public setSearch(event: CustomEvent) {
    const text = (event.detail.value as string).trim().toLowerCase();
    this.searchText = text;
    this.getProperties();
  }

  private searchProperties() {
    this.properties = this.properties.filter((item: Property) => {
      const name = item.name.toLowerCase();
      const address = item.address.toLowerCase();
      return name.includes(this.searchText) || address.includes(this.searchText);
    });
  }

  private sortProperties() {
    switch (this.sortBy) {
      case 'name':
        this.properties = sortListByName(this.properties, { property: 'name' });
        break;
      case 'price':
        this.properties = sortListByNumber(this.properties, { property: 'price' });
        break;
      default:
        this.properties = sortListByDate(this.properties, { property: 'updatedAt' });
        break;
    }
  }

  private getProperties() {
    this.isLoading.emit(true);
    this.unSubscribed();

    this.propertiesService.properties$.pipe(takeUntil(this.unsubscribe$)).subscribe(v => {
      this.resetBehavior();
      this.properties = this.limit ? v.slice(0, this.limit) : v;
      this.sortProperties();
      // if user toggles to show Owned properties only
      if (this.ownedPropertiesOnly && this.userService.user) {
        this.properties = this.properties.filter(item => item.user_id === this.userService.user.user_id);
      }
      // if user searched for a property
      if (this.searchText) {
        this.searchProperties();
      }
      // if any filters are being selected
      if (this.filterBy.length) {
        this.properties = this.properties.filter(item => this.filterBy.includes(item.type));
      }
      this.displayedItems = this.properties.slice(0, this.maxDisplayed);
    });
    this.changeDetector.detectChanges();
  }

  private resetBehavior(): void {
    this.displayedItems = [];
    this.properties = [];
    this.maxDisplayed = 8;
  }

  private unSubscribed() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
