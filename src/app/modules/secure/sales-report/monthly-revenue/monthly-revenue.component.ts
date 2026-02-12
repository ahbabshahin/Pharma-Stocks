import { CommonModule, DatePipe } from '@angular/common';
import { Component, Signal, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { BarGraphComponent } from 'src/app/common-component/bar-graph/bar-graph.component';
import { DualBarGraphComponent } from 'src/app/common-component/dual-bar-graph/dual-bar-graph.component';
import { SalesReportStoreService } from 'src/app/service/sales-report/sales-report-store.service';
import { BarGraph } from 'src/app/store/models/common.model';
import { MonthlyRevenue } from 'src/app/store/models/sales-report.model';

@Component({
	standalone: true,
	selector: 'app-monthly-revenue',
	templateUrl: './monthly-revenue.component.html',
	styleUrl: './monthly-revenue.component.scss',
	imports: [CommonModule, BarGraphComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthlyRevenueComponent {
	grandTotals: any;
	monthlyRevenue = input<MonthlyRevenue[]>();
	isAmount = input<boolean>();

	monthlyRevenueBarGraph = computed(() => {
		const isAmount = this.isAmount();
		const monthlyRevenue = this.monthlyRevenue() as MonthlyRevenue[] || [];
		const barGraph: BarGraph = {
			labels: monthlyRevenue.map((item: MonthlyRevenue) => item?.month),
			indexAxis: 'x',
			datasets: {
				label: `${isAmount ? 'Monthly Revenue' : 'Monthly Quantity Sold'}`,
				data: monthlyRevenue.map((item) =>
					isAmount ? item?.totalRevenue : item?.totalQuantity,
				),
			},
		};
		return barGraph;
		// return expression;
	});
}
