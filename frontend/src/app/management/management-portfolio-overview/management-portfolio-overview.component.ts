import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  effect,
  inject
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Chart, registerables } from 'chart.js';
import { PropertiesService } from '@app/properties/properties.service';
import { TransactionType } from '@app/shared/enums/property';
import { Property } from '@app/shared/interface/property';

Chart.register(...registerables);

@Component({
  selector: 'app-management-portfolio-overview',
  templateUrl: './management-portfolio-overview.component.html',
  styleUrls: ['./management-portfolio-overview.component.css'],
  standalone: false
})
export class ManagementPortfolioOverviewComponent
  implements AfterViewInit, OnDestroy
{
  private readonly propertiesService = inject(PropertiesService);

  @ViewChild('portfolioCanvas')
  private portfolioCanvas?: ElementRef<HTMLCanvasElement>;

  public readonly ownedProperties = toSignal<
    Property[] | undefined,
    Property[]
  >(this.propertiesService.propertiesOwned$, { initialValue: [] });

  public readonly portfolio = computed(() => {
    const properties = this.ownedProperties() ?? [];

    return {
      total: properties.length,
      forSale: properties.filter(
        (property) => property.transactionType === TransactionType.forSale
      ).length,
      forRent: properties.filter(
        (property) => property.transactionType === TransactionType.forRent
      ).length
    };
  });

  private portfolioChart?: Chart<'doughnut'>;

  private readonly portfolioEffect = effect(() => {
    this.updateChart(this.portfolio());
  });

  public ngAfterViewInit(): void {
    this.renderChart();
  }

  public ngOnDestroy(): void {
    this.portfolioChart?.destroy();
  }

  private renderChart(): void {
    const context = this.portfolioCanvas?.nativeElement.getContext('2d');

    if (!context) {
      return;
    }

    this.portfolioChart = new Chart<'doughnut'>(context, {
      type: 'doughnut',
      data: {
        labels: ['For sale', 'For rent'],
        datasets: [
          {
            data: [this.portfolio().forSale, this.portfolio().forRent],
            backgroundColor: ['#f28c2e', '#29c065'],
            borderWidth: 0,
            hoverOffset: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        animation: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        }
      }
    });
  }

  private updateChart(portfolio: { forSale: number; forRent: number }): void {
    if (!this.portfolioChart) {
      return;
    }

    this.portfolioChart.data.datasets[0].data = [
      portfolio.forSale,
      portfolio.forRent
    ];
    this.portfolioChart.update();
  }
}
