import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { StorageService } from 'src/app/shared/services/storage/storage.service';

Chart.register(...registerables);

@Component({
  selector: 'app-mortgage-pie-chart',
  templateUrl: './mortgage-pie-chart.component.html',
  styleUrls: ['./mortgage-pie-chart.component.scss'],
})
export class MortgagePieChartComponent implements OnInit {

  private pieChart: Chart;
  constructor(private storage: StorageService) { }

  ngOnInit() { }
  async setChart(event) {
    const { totalMonth, interest, tax, insurance } = event;
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    await this.storage.init();
    const isDark = await this.storage.getDartTheme();
    const fontColor = isDark ? '#fff' : '#333';
    const data = {
      labels: ['Principal', 'Interest', 'Property Tax', 'Insurance'],
      datasets: [
        {
          label: 'Dataset 1',
          data: [
            (totalMonth - interest),
            interest,
            tax || 0,
            insurance || 0
          ],
          backgroundColor: ['#428cff', '#e0bb2e', '#e04055', '#29c467',],
          borderWidth: 0, //this will hide border
        }
      ]
    };
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    this.pieChart = new Chart(ctx,
      {
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
          },
        },
      }
    );

  }
}
