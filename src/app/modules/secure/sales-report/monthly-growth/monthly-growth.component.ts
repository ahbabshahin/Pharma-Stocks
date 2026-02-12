import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, Signal } from '@angular/core';
import { DualBarGraphComponent } from 'src/app/common-component/dual-bar-graph/dual-bar-graph.component';
import { SalesReportStoreService } from 'src/app/service/sales-report/sales-report-store.service';
import { BarGraph } from 'src/app/store/models/common.model';
import { MonthlyRevenue } from 'src/app/store/models/sales-report.model';

@Component({
	standalone: true,
	selector: 'app-monthly-growth',
	templateUrl: './monthly-growth.component.html',
	styleUrl: './monthly-growth.component.scss',
	imports: [
		CommonModule,
		DualBarGraphComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthlyGrowthComponent {
	monthlyRevenue = input<MonthlyRevenue[]>();

	constructor(private salesReportStore: SalesReportStoreService) {}

	monthlyGrowthBarGraph = computed(() => {
		const monthlyGrowth = this.monthlyRevenue() as MonthlyRevenue[] || [];
		const barGraph: BarGraph = {
			labels: monthlyGrowth.map((item: MonthlyRevenue) => item?.month),
			indexAxis: 'x',
			datasets: {
				label: `Monthly Growth`,
				data: monthlyGrowth.map((item) => item?.growth || 0),
			},
		};
		return barGraph;
		// return expression;
	});
}
