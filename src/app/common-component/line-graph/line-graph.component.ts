import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BarGraph } from '../../store/models/common.model';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-line-graph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './line-graph.component.html',
  styleUrl: './line-graph.component.scss',
})
export class LineGraphComponent {
  @Input() barGraph: BarGraph;
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
    console.log(this.barGraph);
    if (this.chart) {
    }
    this.initializeChart();
    if (this.chart) {
    }
  }

  initializeChart() {
    // if (!this.barGraph) return;
    if (this.barGraph === undefined) return;
    console.log('barGraph inside line graph', this.barGraph);

    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    if (!ctx) return;
    if (this.chart)
      this.chart.destroy();
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.barGraph.labels, // X-axis (Date)
        datasets: [
          {
            label: 'Total Revenue',
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            fill: true,
            data: this.barGraph.datasets.data, // Y-axis (Revenue)
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
            title: { display: true, text: 'Date' },
          },
          y: {
            title: { display: true, text: 'Daily Sales' },
            beginAtZero: true,
          },
        },
      },
    });
      this.chart.update();
  }
}
