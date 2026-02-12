import { Component, Input, output } from '@angular/core';
import { SalesReportPeriod, PaymentStatus } from '../../store/models/common.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CustomerListComponent } from '../../modules/secure/sold-products/customer-list/customer-list.component';
import { FilterService } from '../../service/filter/filter.service';

@Component({
	standalone: true,
	selector: 'app-filter',
	templateUrl: './filter.component.html',
	styleUrl: './filter.component.scss',
	imports: [
		CommonModule,
		FormsModule,
		NzSelectModule,
		NzDatePickerModule,
		NzRadioModule,
		NzAffixModule,
	],
})
export class FilterComponent {
	@Input() title: string = '';
	@Input() isAmountNeeded: boolean = true;
	Object = Object;
	isAmount: boolean = true;
	selectedDate: Date = new Date();
	formattedDate: string = '';
	navHeight: number = 60;
	period: SalesReportPeriod = SalesReportPeriod.MONTHLY;
	status: PaymentStatus = PaymentStatus.ALL;
	SalesReportPeriod = SalesReportPeriod;
	PaymentStatus = PaymentStatus;

	onTypeChange = output<boolean>();
	constructor(private filterServie: FilterService) {}

	ngOnInit() {
		this.initialize();
	}

	initialize() {
		this.onDateChange();
	}

	onPeriodChange() {
		this.filterServie.setFilterPeriod(this.period);
	}

	onDateChange(): void {
		this.formattedDate = this.filterServie.formatSelectedDate(
			this.selectedDate,
		);
		this.filterServie.setFilterDate(this.formattedDate);
	}

	onStatusChange(): void {
		this.filterServie.setFilterStatus(this.status);

		// this.dispatchActions();
	}

	typeChange(){
		this.onTypeChange.emit(this.isAmount);
	}

	ngOnDestroy() {}
}
