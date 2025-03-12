import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BarGraph } from '../../store/models/common.model';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-line-graph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './line-graph.component.html',
  styleUrl: './line-graph.component.scss'
})
export class LineGraphComponent {
  barGraph: BarGraph;
  constructor() {}

  ngOnInit(){
    this.initialize();
  }

  initialize(){
    this.initializeChart();
  }


  initializeChart(){
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.barGraph?.labels,
        datasets: [
          {
            label: this.barGraph?.datasets?.label,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: this.barGraph?.datasets?.data?.map(
              () =>
                `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
                  Math.random() * 255
                )}, ${Math.floor(Math.random() * 255)})`
            ),
            data: this.barGraph?.datasets?.data,
          },
        ],
      },
    });
  }

}
