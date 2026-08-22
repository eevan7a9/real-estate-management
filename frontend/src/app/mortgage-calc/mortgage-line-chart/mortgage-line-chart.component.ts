import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { StorageService } from 'src/app/shared/services/storage/storage.service';

Chart.register(...registerables);

@Component({
  selector: 'app-mortgage-line-chart',
  templateUrl: './mortgage-line-chart.component.html',
  styleUrls: ['./mortgage-line-chart.component.css'],
  standalone: false
})
export class MortgageLineChartComponent implements OnDestroy {
  @ViewChild('lineCanvas') private canvas?: ElementRef<HTMLCanvasElement>;
  private lineChart?: Chart;
  private renderVersion = 0;

  constructor(private storage: StorageService) {}

  async setChart(
    schedule: {
      payment: number;
      principal: number;
      interest: number;
      balance: number;
      accInterest: number;
      accPrincipal: number;
      date: string;
    }[] = []
  ) {
    const renderVersion = ++this.renderVersion;
    if (schedule.length > 151) {
      schedule = schedule.filter((v, i) => {
        if (i === schedule.length - 1) {
          return v;
        }
        return i % 2 === 0;
      });
    }
    const dates = schedule.map((item) => item.date);
    const balance = schedule.map((item) => item.balance);
    const principal = schedule.map((item) => item.accPrincipal);
    const interest = schedule.map((item) => item.accInterest);

    this.lineChart?.destroy();
    await this.storage.init();
    const isDark = await this.storage.getDartTheme();
    if (renderVersion !== this.renderVersion) return;
    const fontColor = isDark ? '#fff' : '#333';
    const data = {
      labels: dates,
      axis: 'y',
      scaleFontColor: 'red',
      datasets: [
        {
          label: 'Balance',
          data: balance,
          borderColor: 'green',
          backgroundColor: 'green'
        },
        {
          label: 'Principal',
          data: principal,
          borderColor: 'blue',
          backgroundColor: 'blue'
        },
        {
          label: 'Interest',
          data: interest,
          borderColor: 'red',
          backgroundColor: '#d0001d91'
        }
      ]
    };
    const canvas = this.canvas?.nativeElement;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    this.lineChart = new Chart(ctx, {
      type: 'line',
      data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: fontColor
            }
          },
          title: {
            display: true,
            text: 'Amortization schedule ',
            color: fontColor,
            font: {
              size: 18
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: fontColor
            }
          },
          y: {
            ticks: {
              color: fontColor
            }
          }
        },
        elements: {
          point: {
            radius: 0
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.lineChart?.destroy();
  }
}
