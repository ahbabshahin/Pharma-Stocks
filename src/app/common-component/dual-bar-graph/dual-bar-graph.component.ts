import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { SalesReportService } from 'src/app/service/sales-report/sales-report.service';
import { BarGraph } from 'src/app/store/models/common.model';
import { SubSink } from 'subsink';
import ChartDataLabels from 'chartjs-plugin-datalabels';
@Component({
	standalone: true,
	selector: 'app-dual-bar-graph',
	templateUrl: './dual-bar-graph.component.html',
	styleUrl: './dual-bar-graph.component.scss',
	imports: [CommonModule],
})
export class DualBarGraphComponent {
	@Input() barGraph: BarGraph;
	subs = new SubSink();
	chart: Chart;
	canvasId: string = this.salesReportService.randomIdForCnavas();
	constructor(private salesReportService: SalesReportService) {}

	ngOnInit() {
		// Chart.register(ChartDataLabels);
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

	// initializeChart() {
	// 	const ctx = document.getElementById(this.canvasId) as HTMLCanvasElement;
	// 	if (!ctx) return;
	// 	if (this.chart) this.chart.destroy();
	// 	this.chart = new Chart(ctx, {
	// 		type: 'bar',
	// 		plugins: [ChartDataLabels],
	// 		data: {
	// 			labels: this.barGraph?.labels,
	// 			datasets: [
	// 				{
	// 					label: this.barGraph?.datasets?.label,
	// 					borderColor: 'rgb(255, 99, 132)',
	// 					backgroundColor: this.barGraph?.datasets?.data.map(
	// 						(data) => (data > 0 ? `#008001` : `#ff0000`),
	// 					),
	// 					data: this.barGraph?.datasets?.data,
	// 				},
	// 			],
	// 		},
	// 		options: {
	// 			responsive: true,
	// 			scales: {
	// 				y: {
	// 					grace: '10%',
	// 					beginAtZero: false, // Allows the axis to go below zero
	// 					ticks: {
	// 						callback: (value) => value + '%', // Add percentage sign
	// 					},
	// 					grid: {
	// 						// Highlight the zero line specifically
	// 						color: (context) =>
	// 							context.tick.value === 0 ? '#000' : '#e5e5e5',
	// 						lineWidth: (context) =>
	// 							context.tick.value === 0 ? 2 : 1,
	// 					},
	// 				},
	// 			},
	// 			plugins: {
	// 				tooltip: {
	// 					callbacks: {
	// 						label: (context) => `Growth: ${context.raw}%`,
	// 					},
	// 				},
	// 				datalabels: {
	// 					display: true,
	// 					// 'end' puts the label at the far edge of the bar
	// 					anchor: 'end',
	// 					// 'align' determines if it sits inside or outside the edge
	// 					align: 'top',
	// 					offset: 4, // Space between bar and text
	// 					formatter: (value) => value + '%',

	// 					color: (context) => {
	// 						// Match text color to bar color or keep it neutral
	// 						return context.dataset.data?.[context.dataIndex] ||
	// 							0 > 0
	// 							? '#2e7d32'
	// 							: '#d32f2f';
	// 					},
	// 					font: {
	// 						weight: 'bold',
	// 						size: 12,
	// 					},
	// 				},
	// 			},
	// 		},
	// 	});
	// 	this.chart.update();
	// }

	initializeChart() {
		const ctx = document.getElementById(this.canvasId) as HTMLCanvasElement;
		if (!ctx) return;
		if (this.chart) this.chart.destroy();

		this.chart = new Chart(ctx, {
			type: 'bar',
			plugins: [ChartDataLabels], // Add this to ensure the plugin is active for this instance
			data: {
				labels: this.barGraph?.labels,
				datasets: [
					{
						label: this.barGraph?.datasets?.label,
						backgroundColor: this.barGraph?.datasets?.data.map(
							(val) => (val >= 0 ? `#008001` : `#ff0000`),
						),
						data: this.barGraph?.datasets?.data,
					},
				],
			},
			options: {
				responsive: true,
				layout: {
					padding: {
						top: 20, // Extra space so top labels don't hit the ceiling
					},
				},
				scales: {
					y: {
						grace: '15%', // Gives more room for labels
						ticks: {
							callback: (value) => value + '%',
						},
						grid: {
							color: (context) =>
								context.tick.value === 0 ? '#000' : '#e5e5e5',
							lineWidth: (context) =>
								context.tick.value === 0 ? 2 : 1,
						},
					},
				},
				plugins: {
					// Ensure datalabels is inside the plugins object
					datalabels: {
						display: true,
						anchor: 'end',
						align: 'top',
						offset: 4,
						// Use 'value' directly
						formatter: (value) => {
							return value !== undefined && value !== null
								? value + '%'
								: '';
						},
						color: (context) => {
							const val = context.dataset.data[
								context.dataIndex
							] as number;
							return val >= 0 ? '#2e7d32' : '#d32f2f';
						},
						font: {
							weight: 'bold',
							size: 11,
						},
					},
					tooltip: {
						callbacks: {
							label: (context) => `Growth: ${context.raw}%`,
						},
					},
				},
			},
		});
	}

	ngOnDestroy() {
		this.chart.destroy();
	}
}
