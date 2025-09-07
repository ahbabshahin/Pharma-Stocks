import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { PieGraph } from '../../store/models/common.model';

@Component({
  standalone: true,
  selector: 'app-pie-graph',
  templateUrl: './pie-graph.component.html',
  styleUrl: './pie-graph.component.scss',
  imports: [CommonModule],
})
export class PieGraphComponent {
  @Input() pieGraph: PieGraph;
  chart: Chart;

  ngOnInit() {
    this.initializeChart();
  }

  ngAfterViewInit() {
    this.initializeChart();
  }

  ngOnChanges() {
    this.initializeChart();
  }

  initializeChart() {
    const ctx = document.getElementById('pieGraph') as HTMLCanvasElement;
    if (!ctx) return;
    if (this.chart) this.chart.destroy();

    const {
      datasets: { label, data },
      labels,
    } = this.pieGraph;

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            label,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: data.map(
              () =>
                `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
                  Math.random() * 255
                )}, ${Math.floor(Math.random() * 255)})`
            ),
            borderWidth: 1,
            data,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // ✅ allow resizing inside container
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
        },
      },
    });
    this.chart.update();
  }

  ngOnDestroy() {
   this.chart.destroy();
  }
}
