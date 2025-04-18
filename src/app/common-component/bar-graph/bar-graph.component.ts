import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import Chart from 'chart.js/auto';
import { SubSink } from 'subsink';
import { BarGraph } from '../../store/models/common.model';

@Component({
  selector: 'app-bar-graph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bar-graph.component.html',
  styleUrl: './bar-graph.component.scss',
})
export class BarGraphComponent {
  @Input() barGraph: BarGraph;
  subs = new SubSink();
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
    this.initializeChart();
  }

  initializeChart() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    if (!ctx) return;
    if (this.chart) this.chart.destroy();
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.barGraph?.labels,
        datasets: [
          {
            label: this.barGraph?.datasets?.label,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: this.barGraph?.datasets?.data.map(
              () =>
                `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
                  Math.random() * 255
                )}, ${Math.floor(Math.random() * 255)})`
            ),
            data: this.barGraph?.datasets?.data,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
          },
        },
      },
    });
    this.chart.update();
  }

  ngOnDestroy() {}
}
