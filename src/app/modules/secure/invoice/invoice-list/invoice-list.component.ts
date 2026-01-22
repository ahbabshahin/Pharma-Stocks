import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { LoaderComponent } from 'src/app/common-component/loader/loader.component';
import { NoDataComponent } from 'src/app/common-component/no-data/no-data.component';
import { AreaCode } from 'src/app/store/models/area-code.model';
import { Customer } from 'src/app/store/models/customer.model';
import { Invoice } from 'src/app/store/models/invoice.model';

@Component({
	standalone: true,
	selector: 'app-invoice-list',
	templateUrl: './invoice-list.component.html',
	styleUrl: './invoice-list.component.scss',
	imports: [
		CommonModule,
		NoDataComponent,

		NzCollapseModule,
		NzButtonModule,
		NzTagModule,
		NzIconModule,
	],
})
export class InvoiceListComponent {
	invoices = input<Invoice<Customer<AreaCode>>[]>();
	onViewInvoice = output<Invoice<Customer<AreaCode>>>();
	viewInvoice(invoice: Invoice<Customer<AreaCode>>) {
		if (invoice) {
			this.onViewInvoice.emit(invoice);
		}
	}

}
