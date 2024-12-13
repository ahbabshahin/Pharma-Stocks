import { Component } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NewInvoiceComponent } from './new-invoice/new-invoice.component';
import { InvoiceStoreService } from '../../service/invoice/invoice-store.service';
import{ SubSink } from 'subsink';
import { Invoice } from '../../store/models/invoice.model';
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss',
})
export class InvoiceComponent {
  createdAt!: Date;
  status!: boolean;
  products!: any[];
  totalAmount!: number;
  taxRate!: number;
  subs = new SubSink();
  params = {
    page: 1,
    limit: 10,
    status: 'due',
  };
  invoices: Invoice[] = [];

  constructor(
    private drawerService: NzDrawerService,
    private invoiceStoreService: InvoiceStoreService
  ) {}

  ngOnInit() {
    this.createdAt = new Date();
    this.status = true;
    this.initialize();
  }

  initialize() {
    this.loadInvoice();
    this.isInvoiceLoaded();
    this.getInvoices();
  }

  loadInvoice() {
    this.invoiceStoreService.setLoader(true);
    this.invoiceStoreService.loadInvoice(this.params);
  }

  getInvoices(){
    this.subs.sink = this.invoiceStoreService
      .getInvoices()
      .subscribe({next:(res: Invoice[]) => {
        this.invoices = res;
      },
      error:() =>{
        console.log('error');
      }
    });
  }

  isInvoiceLoaded() {
    this.subs.sink = this.invoiceStoreService
      .getInvoiceLoaded()
      .subscribe((loaded: boolean) => {
        if (loaded) {
          this.loadInvoice();
        }
      });
  }

  addInvoice() {
    this.drawerService.create({
      nzTitle: 'New Invoice',
      nzClosable: true,
      nzMaskClosable: false,
      nzSize: 'large',
      nzContent: NewInvoiceComponent,
    });
  }

  generatePDF() {}
}
