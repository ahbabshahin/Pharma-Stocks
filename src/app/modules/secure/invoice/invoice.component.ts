import { Component, OnInit, OnDestroy, Signal, signal, effect } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { SubSink } from 'subsink';
import { Invoice } from '../../../store/models/invoice.model';
import { InvoiceStoreService } from '../../../service/invoice/invoice-store.service';
import { catchError, filter, Observable, of, switchMap, tap } from 'rxjs';
import { Customer } from '../../../store/models/customer.model';
import { DatePipe } from '@angular/common';
import { InvoiceApiService } from '../../../service/invoice/invoice-api.service';
import { CommonService } from '../../../service/common/common.service';
import { AreaCode } from 'src/app/store/models/area-code.model';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { InvoiceService } from 'src/app/service/invoice/invoice.service';

type ComponentState = {
  invoices: Signal<Invoice<Customer<AreaCode>>[]>;
  total: Signal<number>;
  isMore: boolean;
  customers: Customer<AreaCode>[];
  startDate: string;
  endDate: string;
  searchText: string;
};

type SearchParams = {
	page: number;
	limit: number;
	status: string;
	search?: string;
	startDate?: string;
	endDate?: string;
}
@Component({
	selector: 'app-invoice',
	templateUrl: './invoice.component.html',
	styleUrl: './invoice.component.scss',
})
export class InvoiceComponent implements OnInit, OnDestroy {
	params = {
		page: 1,
		limit: 10,
		status: '',
	};
	searchParams: {
		page: number;
		limit: number;
		status: string;
		search?: string;
		startDate?: string;
		endDate?: string;
	} = {
		...this.params,
		search: '',
		startDate: '',
		endDate: '',
	};
	componentState: ComponentState;
	loader: {
		loader: Signal<boolean>;
		subLoader: Signal<boolean>;
	} = {
		loader: this.invoiceStoreService.getInvoiceLoader,
		subLoader: this.invoiceStoreService.getInvoiceSubLoader,
	};

	invoiceLoaded: Signal<boolean> = this.invoiceStoreService.getInvoiceLoaded;

	constructor(
		private drawerService: NzDrawerService,
		private invoiceStoreService: InvoiceStoreService,
		private datePipe: DatePipe,
		private invoiceApi: InvoiceApiService,
		private commonService: CommonService,
		private invoiceService: InvoiceService,
	) {
		effect(() => {
			const file = this.excelDownload();
			if (file) {
				this.handleFileDownload(file);
			}
		});
	}

	ngOnInit() {
		this.initialize();
	}

	initialize() {
		this.componentState = {
			...this.componentState,
			invoices: this.invoiceStoreService.invoices,
			customers: [],
			total: this.invoiceStoreService.totalInvoice,
			isMore: false,
			startDate: '',
			endDate: '',
			searchText: '',
		};
		this.isInvoiceLoaded();
	}

	loadInvoice() {
		if (!this.params.status) this.params.status = '';
		this.invoiceStoreService.loadInvoice(
			this.params,
			this.componentState?.isMore,
		);
		this.checkIsMore();
	}

	isInvoiceLoaded() {
		if (!this.invoiceLoaded()) {
			this.invoiceStoreService.setLoader(true);
			this.loadInvoice();
		}
	}

	async addInvoice(invoice?: Invoice<Customer<AreaCode>>) {
		const { NewInvoiceComponent } =
			await import('./new-invoice/new-invoice.component');
		this.drawerService.create({
			nzTitle: 'New Invoice',
			nzClosable: true,
			nzMaskClosable: false,
			nzWidth: '100%',
			nzWrapClassName: 'full-drawer',
			nzContent: NewInvoiceComponent,
			nzData: { invoice, total: this.componentState?.total },
		});
	}

	async viewInvoice(invoice: Invoice<Customer<AreaCode>>) {
		const { ViewInvoiceComponent } =
			await import('./view-invoice/view-invoice.component');
		if (invoice) {
			this.drawerService.create({
				nzTitle: 'View Invoice',
				nzClosable: true,
				nzMaskClosable: false,
				nzWidth: '100%',
				nzWrapClassName: 'full-drawer',
				nzContent: ViewInvoiceComponent,
				nzData: { invoice },
			});
		}
	}

	clearSearch() {
		this.componentState = {
			...this.componentState,
			searchText: '',
		};
		this.onSearch('');
		this.searchParams = {
			...this.searchParams,
			search: this.componentState?.searchText,
		};

		this.searchInvoice();
	}

	onSearch(e: any) {
		if (e?.target) {
			this.componentState = {
				...this.componentState,
				searchText: e.target.value?.trim(),
			};
			this.params = {
				...this.params,
				page: 1,
			};
			this.searchParams = {
				...this.searchParams,
				...this.params,
				search: this.componentState?.searchText,
			};
			if (
				this.componentState?.startDate == '' &&
				this.componentState?.endDate == ''
			) {
				delete this.searchParams.startDate;
				delete this.searchParams.endDate;
			}
			this.componentState = {
				...this.componentState,
				isMore: false,
			};
			this.searchInvoice();
		}
	}

	searchInvoice() {
		this.invoiceStoreService.setInvoiceLoaded(true);
		this.invoiceStoreService.searchInvoice(
			this.searchParams,
			this.componentState?.isMore,
		);

		this.checkIsMore();
	}

	formatDate(date: Date) {
		return this.datePipe.transform(date, 'yyyy-MM-dd');
	}

	onDateInputChange() {
		if (this.componentState?.startDate && this.componentState?.endDate) {
			this.params = {
				...this.params,
				page: 1,
			};
			this.searchParams = {
				...this.searchParams,
				...this.params,
				startDate: this.componentState?.startDate,
				endDate: this.componentState?.endDate,
			};
			if (this.componentState?.searchText == '') {
				delete this.searchParams.search;
			}
		} else {
			delete this.searchParams.startDate;
			delete this.searchParams.endDate;
		}
		this.componentState = {
			...this.componentState,
			isMore: false,
		};
		this.searchInvoice();
	}

	resetSearch() {
		this.params = {
			...this.params,
			page: 1,
			status: '',
		};
		this.searchParams = {
			...this.searchParams,
			...this.params,
			search: '',
			startDate: '',
			endDate: '',
			status: '',
		};
		this.componentState = {
			...this.componentState,
			isMore: false,
			startDate: '',
			endDate: '',
			searchText: '',
		};
		this.invoiceStoreService.setLoader(true);
		this.loadInvoice();
	}

	loadMore() {
		const { invoices, total } = this.componentState;
		if (invoices()?.length < total()) {
			this.invoiceStoreService.setSubLoader(true);
			this.componentState = {
				...this.componentState,
				isMore: true,
			};
			this.params = {
				...this.params,
				page: this.params.page + 1,
			};
			if (
				this.searchParams?.search ||
				this.searchParams?.startDate ||
				this.searchParams?.endDate ||
				this.searchParams?.status
			) {
				this.searchParams = {
					...this.searchParams,
					...this.params,
				};
				this.searchInvoice();
			} else {
				this.loadInvoice();
			}
		}
	}
	status: string = '';
	onStatusChange(status: string) {
		if (status) {
			this.params = {
				...this.params,
				page: 1,
				status: status,
			};
			this.searchParams = {
				...this.searchParams,
				...this.params,
				status,
			};

			if (
				this.componentState?.startDate == '' &&
				this.componentState?.endDate == ''
			) {
				delete this.searchParams.startDate;
				delete this.searchParams.endDate;
			}

			if (this.componentState.searchText === '')
				delete this.searchParams.search;
			this.invoiceStoreService.setLoader(true);
			this.searchInvoice();
		} else {
			this.invoiceStoreService.setLoader(true);
			this.loadInvoice();
		}
	}
	excelGenerationParams = signal<{
		page: number;
		limit: number;
		status: string;
		search?: string;
		startDate?: string;
		endDate?: string;
	} | null>(null);
	downloadInvoiceExcel() {
		this.excelGenerationParams.set({ ...this.searchParams });
		// this.commonService.presentLoading();
		// this.subs.sink = this.invoiceApi
		// 	.downloadSearchedInvoice(this.searchParams)
		// 	.subscribe({
		// 		next: (file) => {
		// 			try {
		// 				const url = window.URL.createObjectURL(file);
		// 				const a = document.createElement('a');
		// 				a.href = url;
		// 				let fileName: string = 'Invoices.xlsx';
		// 				if (
		// 					this.componentState?.startDate &&
		// 					this.componentState?.endDate
		// 				)
		// 					fileName = `Invoices for ${this.componentState?.startDate} to ${this.componentState?.endDate}.xlsx`;
		// 				a.download = fileName;
		// 				a.click();
		// 				URL.revokeObjectURL(url);
		// 				this.commonService.dismissLoading();
		// 			} catch (e) {
		// 				this.commonService.dismissLoading();
		// 			}
		// 		},
		// 		error: (error) => {
		// 			this.commonService.presentToast('Something went wrong')
		// 			this.commonService.dismissLoading();
		// 		},
		// 	});
	}

	excelDownload: Signal<any> = toSignal(
		toObservable(this.excelGenerationParams).pipe(
			filter((params): params is SearchParams => !!params),
			tap(() => this.commonService.presentLoading()),
			switchMap((params) =>
				this.invoiceApi.downloadSearchedInvoice(params).pipe(
					catchError(() => {
						this.commonService.dismissLoading();
						return of(null);
					}),
				),
			),
		),
		{ initialValue: null },
	);

	handleFileDownload(file: Blob) {
		try {
			const url = window.URL.createObjectURL(file);
			const a = document.createElement('a');
			const params = this.excelGenerationParams();

			// Clean string interpolation for dynamic naming
			const fileName =
				params?.startDate && params?.endDate
					? `Invoices for ${params?.startDate} to ${params?.endDate}.xlsx`
					: 'Invoices.xlsx';

			a.href = url;
			a.download = fileName;
			a.click();

			window.URL.revokeObjectURL(url);
		} finally {
			this.commonService.dismissLoading();
		}
	}

	checkIsMore() {
		if (this.componentState?.isMore)
			this.componentState = {
				...this.componentState,
				isMore: false,
			};
	}

	printAll(){
		if(!this.componentState?.invoices) return
		this.invoiceService.printInvoicesBulk(this.componentState?.invoices())
	}

	ngOnDestroy() {}
}
