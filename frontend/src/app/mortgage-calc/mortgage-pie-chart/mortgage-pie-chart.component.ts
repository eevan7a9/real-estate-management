import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { StorageService } from 'src/app/shared/services/storage/storage.service';

type MonthlyPaymentBreakdown = {
  totalMonth: number;
  interest: number;
  tax: number;
  insurance: number;
};

Chart.register(...registerables);

@Component({
  selector: 'app-mortgage-pie-chart',
  templateUrl: './mortgage-pie-chart.component.html',
  styleUrls: ['./mortgage-pie-chart.component.css'],
  standalone: false
})
export class MortgagePieChartComponent implements OnDestroy {
  @ViewChild('pieCanvas') private canvas?: ElementRef<HTMLCanvasElement>;
  private pieChart?: Chart<'doughnut'>;
  private renderVersion = 0;
  constructor(private storage: StorageService) {}

  async setChart(event: MonthlyPaymentBreakdown): Promise<void> {
    const renderVersion = ++this.renderVersion;
    this.pieChart?.destroy();

    const { totalMonth, interest, tax, insurance } = event;
    await this.storage.init();
    const isDark = await this.storage.getDartTheme();
    const fontColor = isDark ? '#fff' : '#333';
    if (renderVersion !== this.renderVersion) return;

    const data = {
      labels: ['Principal', 'Interest', 'Tax', 'Insurance'],
      datasets: [
        {
          label: 'Monthly Payment',
          data: [
            totalMonth - interest - tax - insurance,
            interest,
            tax,
            insurance
          ],
          backgroundColor: ['#428cff', '#e0bb2e', '#e04055', '#29c467'],
          borderWidth: 0 //this will hide border
        }
      ]
    };
    const canvas = this.canvas?.nativeElement;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    this.pieChart = new Chart(ctx, {
      type: 'doughnut',
      data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: fontColor,
              font: {
                size: 14
              }
            }
          },
          title: {
            display: true,
            text: 'Monthly Payment Graph',
            color: fontColor,
            font: {
              size: 18
            }
          }
        }
      }
    });
  }
  ngOnDestroy(): void {
    this.pieChart?.destroy();
  }
}
