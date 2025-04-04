import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LineGraph } from '../../store/models/common.model';
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
  chart: Chart | null = null;
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

    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    this.initializeChart();
  }

  initializeChart() {
    if (!this.lineGraph) return;

    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    if (!ctx) return;
    if (this.chart) this.chart.destroy();
    if(this.lineGraph){
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.lineGraph?.labels, // X-axis (Date)
        datasets: [
          {
            label: this.lineGraph?.yTitle,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            fill: true,
            data: this.lineGraph?.datasets?.data, // Y-axis (Revenue)
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
            title: { display: true, text: this.lineGraph?.xTitle },
          },
          y: {
            title: { display: true, text: this.lineGraph?.yTitle },
            beginAtZero: true,
          },
        },
      },
    });
    this.chart.update();
  }
  }

  ngOnDestroy(){
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
