import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LineGraph, } from '../../store/models/common.model';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-line-graph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './line-graph.component.html',
  styleUrl: './line-graph.component.scss',
})
export class LineGraphComponent {
  @Input() lineGraph: LineGraph;
  chart: Chart;
  constructor() {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.initializeChart();
  }

  ngAfterViewInit() {
    this.initializeChart();
  }

  ngOnChanges() {
    console.log(this.lineGraph);
    this.initializeChart();
  }

  initializeChart() {
    if (this.lineGraph === undefined) return;
    console.log('lineGraph inside line graph', this.lineGraph);

    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    if (!ctx) return;
    if (this.chart)
      this.chart.destroy();
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.lineGraph.labels, // X-axis (Date)
        datasets: [
          {
            label: 'Total Revenue',
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            fill: true,
            data: this.lineGraph.datasets.data, // Y-axis (Revenue)
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
        scales: {
          x: {
            title: { display: true, text: this.lineGraph.xTitle },
          },
          y: {
            title: { display: true, text: this.lineGraph.yTitle },
            beginAtZero: true,
          },
        },
      },
    });
      this.chart.update();
  }
}
