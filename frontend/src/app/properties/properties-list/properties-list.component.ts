import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Property } from 'src/app/shared/interface/property';
import { sortListByDate, sortListByName, sortListByNumber } from 'src/app/shared/utility';
import { PropertiesService } from '../properties.service';

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
  private filterBy: string[] = [];
  private sortBy = 'latest';
  private searchText = '';
  private unsubscribe$ = new Subject<void>();

  constructor(
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

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.displayedItems.length >= this.properties.length) {
        console.log('everything is loaded');
        this.infinityScroll.disabled = true;
      }
    }, 1500);
  }

  public setFilters(filters: string[]) {
    this.filterBy = filters;
    this.getProperties();
  }

  public setSort(sort: string) {
    this.sortBy = sort;
    this.getProperties();
  }

  public setSearch(text: string) {
    text = text.trim().toLowerCase();
    if (this.searchText !== text) {
      this.searchText = text;
      this.getProperties();
    }
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
        this.properties = sortListByDate(this.properties, { property: 'date' });
        break;
    }
  }
  private getProperties() {
    this.isLoading.emit(true);
    this.unSubscribed();
    this.maxDisplayed = 8;
    this.displayedItems = [];
    this.properties = [];
    if (this.infinityScroll) {
      // we enable infinity scroll
      this.infinityScroll.disabled = false;
    }
    this.propertiesService.properties$.pipe(takeUntil(this.unsubscribe$)).subscribe(v => {
      this.properties = this.limit ? v.slice(0, this.limit) : v;
      this.sortProperties();
      if (this.searchText) { this.searchProperties(); };
      if (this.filterBy.length) {
        this.properties = this.properties.filter(item => this.filterBy.includes(item.type));
      }
    });
    this.displayedItems = this.properties.slice(0, this.maxDisplayed);
    this.changeDetector.detectChanges();
  }

  private unSubscribed() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
