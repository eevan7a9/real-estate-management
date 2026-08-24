import { Component, computed, DestroyRef, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  PropertiesDisplayOption,
  TransactionType
} from '../shared/enums/property';
import { Property } from '../shared/interface/property';
import { UserService } from '../user/user.service';
import { ManagementService } from './management.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.page.html',
  styleUrls: ['./management.page.css'],
  standalone: false
})
export class ManagementPage implements OnInit {
  public readonly search = signal('');
  public readonly displayOption = PropertiesDisplayOption.ListView;
  public readonly properties = toSignal<Property[] | undefined>(
    this.managementService.properties$,
    { initialValue: undefined }
  );
  public readonly filteredProperties = computed(() => {
    const query = this.search().trim().toLowerCase();
    const properties = this.properties() || [];
    if (!query) return properties;
    return properties.filter((property) =>
      [property.name, property.address, property.type, property.transactionType]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  });
  public readonly totalProperties = computed(
    () => this.properties()?.length || 0
  );
  public readonly saleProperties = computed(
    () =>
      this.properties()?.filter(
        (property) => property.transactionType === TransactionType.forSale
      ).length || 0
  );
  public readonly rentalProperties = computed(
    () =>
      this.properties()?.filter(
        (property) => property.transactionType === TransactionType.forRent
      ).length || 0
  );
  public readonly totalValue = computed(
    () =>
      this.properties()?.reduce(
        (total, property) => total + (Number(property.price) || 0),
        0
      ) || 0
  );

  constructor(
    public managementService: ManagementService,
    public userService: UserService,
    private router: Router,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.userService.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        if (user) void this.managementService.loadProperties();
      });
  }
  public signIn(): void {
    void this.router.navigate(['/user/signin'], {
      queryParams: { redirect: '/management' }
    });
  }
  public openProperties(): void {
    void this.router.navigate(['/properties']);
  }
}
