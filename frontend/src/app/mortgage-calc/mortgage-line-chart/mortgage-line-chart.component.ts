import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { StorageService } from 'src/app/shared/services/storage/storage.service';

Chart.register(...registerables);

@Component({
  selector: 'app-mortgage-line-chart',
  templateUrl: './mortgage-line-chart.component.html',
  styleUrls: ['./mortgage-line-chart.component.scss'],
})
export class MortgageLineChartComponent implements OnInit {

  @Output() generateSchedule = new EventEmitter<boolean>();
  public showReCalculate = false;
  private isChanged = false;
  private lineChart: Chart;

  constructor(private storage: StorageService) { }

  ngOnInit() { }

  async setChart(schedule: {
    payment: number;
    principal: number;
    interest: number;
    balance: number;
    accInterest: number;
    accPrincipal: number;
    date: string;
  }[] = []) {
    if (schedule.length > 151) {
      schedule = schedule.filter((v, i) => {
        if (i === schedule.length - 1) {
          return v;
        }
        return i % 2 === 0;
      });
    }
    const dates = schedule.map(item => item.date);
    const balance = schedule.map(item => item.balance);
    const principal = schedule.map(item => item.accPrincipal);
    const interest = schedule.map(item => item.accInterest);

    if (this.lineChart) {
      this.lineChart.destroy();
    }
    await this.storage.init();
    const isDark = await this.storage.getDartTheme();
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
          backgroundColor: 'green',
        },
        {
          label: 'Principal',
          data: principal,
          borderColor: 'blue',
          backgroundColor: 'blue',
        },
        {
          label: 'Interest',
          data: interest,
          borderColor: 'red',
          backgroundColor: '#d0001d91',
        }
      ]
    };
    const canvas = document.getElementById('lineChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    this.lineChart = new Chart(ctx,
      {
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
            ,
          },
          elements: {
            point: {
              radius: 0
            }
          }
        },
      }
    );
  }

  requestAmortizationSchedule() {
    this.showReCalculate = false;
    this.generateSchedule.emit(true);
    const chart = document.getElementById('lineChart');
    setTimeout(() => {
      chart.scrollIntoView({ behavior: 'smooth' });
    }, 600);
  }

  scheduleIsChanged() {
    if (!this.isChanged) {
      this.showReCalculate = false;
      this.isChanged = true;
      return;
    }
    this.showReCalculate = true;
  }
}
