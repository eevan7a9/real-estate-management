import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { StorageService } from 'src/app/shared/services/storage/storage.service';

Chart.register(...registerables);

@Component({
  selector: 'app-mortgage-pie-chart',
  templateUrl: './mortgage-pie-chart.component.html',
  styleUrls: ['./mortgage-pie-chart.component.scss'],
})
export class MortgagePieChartComponent implements OnInit {

  constructor(private storage: StorageService) { }

  ngOnInit() {

    this.setChart();
  }

  async setChart() {
    await this.storage.init();
    const isDark = await this.storage.getDartTheme();
    const fontColor = isDark ? '#fff' : '#333';
    const data = {
      labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
      datasets: [
        {
          label: 'Dataset 1',
          data: [3, 4, 5, 6, 7],
          backgroundColor: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
          borderWidth: 0, //this will hide border
        }
      ]
    };
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const myChart = new Chart(ctx,
      {
        type: 'pie',
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
              text: 'How is my monthly payment calculated?',
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
