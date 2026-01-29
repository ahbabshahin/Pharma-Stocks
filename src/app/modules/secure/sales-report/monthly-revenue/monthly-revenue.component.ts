import { CommonModule, DatePipe } from '@angular/common';
import { Component, Signal, computed, input } from '@angular/core';
import { BarGraphComponent } from 'src/app/common-component/bar-graph/bar-graph.component';
import { SalesReportStoreService } from 'src/app/service/sales-report/sales-report-store.service';
import { BarGraph } from 'src/app/store/models/common.model';
import { MonthlyRevenue } from 'src/app/store/models/sales-report.model';

@Component({
	standalone: true,
	selector: 'app-monthly-revenue',
	templateUrl: './monthly-revenue.component.html',
	styleUrl: './monthly-revenue.component.scss',
	imports: [CommonModule, BarGraphComponent],
})
export class MonthlyRevenueComponent {
	grandTotals: any;
	monthlyRevenue: Signal<MonthlyRevenue[]> =
		this.salesReportStore.getMonthlyRevenue;
	isAmount = input<boolean>()

	constructor(private salesReportStore: SalesReportStoreService, private datePipe: DatePipe,) {}

	monthlyRevenueBarGraph = computed(() => {
		const isAmount = this.isAmount();
		const monthlyRevenue = this.salesReportStore.getMonthlyRevenue();
		const barGraph: BarGraph = {
			labels: monthlyRevenue.map((item: MonthlyRevenue) => item?.month),
			indexAxis: 'x',
			datasets: {
				label: `Monthly Revenue by ${isAmount ? 'Price' : 'Quantity'}`,
				data: monthlyRevenue.map((item) =>
					isAmount ? item?.totalRevenue : item?.totalQuantity,
				),
			},
		};
		return barGraph;
		// return expression;
	});

}
