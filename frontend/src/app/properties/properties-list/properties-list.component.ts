import {
  Component,
  computed,
  input,
  model,
  OnInit,
  output,
  ViewChild,
} from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Property } from 'src/app/shared/interface/property';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { PropertiesDisplayOption } from 'src/app/shared/enums/property';
import {
  filterProperties,
  searchProperties,
  sortProperties,
} from 'src/app/shared/utility/properties';

@Component({
  selector: 'app-properties-list',
  templateUrl: './properties-list.component.html',
  styleUrls: ['./properties-list.component.css'],
  standalone: false,
})
export class PropertiesListComponent implements OnInit {
  @ViewChild('IonInfiniteScroll', { static: false })
  infinityScroll!: IonInfiniteScroll;


  public properties = input<Property[]>();
  public displayOption = input<PropertiesDisplayOption>(
    PropertiesDisplayOption.CardView,
  );
  public singleCol = input<boolean>(false);
  public horizontalSlide = input<boolean>(false);
  public limit = input<number>(0);
  public enableOwnedBadge = input<boolean>(false);
  public enablePopupOptions = input<boolean>(false);
  public hasMore = input<boolean>(true);

  public onLoadMore = output<void>();

  public disableInfinitScroll = model(false);

  public hasNoMore = computed<boolean>(() => !this.hasMore());
  public propertiesList = computed<Property[]>(() => {
    if (!this.properties()) {
      return [];
    }
    let temp = this.limit()
      ? this.properties()?.slice(0, this.limit())
      : this.properties();

    const queryParams = this.queryParams();
    if (!queryParams || !temp) return [];

    const { sort, search, filter } = queryParams;
    if (search) temp = searchProperties(search, temp);
    if (filter) temp = filterProperties(filter, temp);

    temp = sortProperties(sort || 'latest', temp);
    return temp;
  });

  private queryParams = toSignal(this.activatedRoute.queryParams);

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void { }

  public async setInfinityScrollComplete() {
    if (this.infinityScroll) {
      this.infinityScroll.complete();
    }
  }
}
