import { Component, computed, Injector, Signal } from '@angular/core';
import { Business } from 'src/app/store/models/business.model';
import { Customer } from 'src/app/store/models/customer.model';
import { Invoice, Product } from 'src/app/store/models/invoice.model';
import { CommonService } from 'src/app/service/common/common.service';
import { NewInvoiceComponent } from 'src/app/modules/secure/invoice/new-invoice/new-invoice.component';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { InvoiceStoreService } from 'src/app/service/invoice/invoice-store.service';
import { CustomerStoreService } from 'src/app/service/customer/customer-store.service';
import { BusinessService } from 'src/app/service/business/business.service';
import { AuthStoreService } from 'src/app/service/auth/auth-store.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrl: './view-invoice.component.scss',
})
export class ViewInvoiceComponent {
  invoice!: Invoice<Customer>;
  business: Business;
  invoiceNumber: number;
  date: string;
  invoiceStatus: string;
  products: any;
  discount: number;
  totalAmount: number;
  isAdmin: boolean = false;

	// signal
	invoiceSignal: Signal<Invoice<Customer> | null>;
  constructor(
    private commonService: CommonService,
    private drawerService: NzDrawerService,
    private invoiceStore: InvoiceStoreService,
    private businessService: BusinessService,
    private authStore: AuthStoreService,
    private drawerRef: NzDrawerRef,
    private datePipe: DatePipe,
	private injector: Injector,
  ) {}

  ngOnInit() {
	  this.initialize();
  }

  async initialize() {
	this.invoiceSignal = toSignal(
		this.invoiceStore.getInvoiceById(this.invoice?._id as string),
		{
			initialValue: null,
			injector: this.injector,
		}
	);
    await this.isAdminUser();
    this.getBusiness();
    this.date = this.datePipe.transform(this.invoiceSignal()?.createdAt, 'dd-MM-yyyy') as string;
  }

  getBusiness() {
    let business = this.businessService.getBusiness();
    if (business) this.business = business;
  }

  async isAdminUser() {

    this.isAdmin = await this.authStore.isAdminUser();

  }

  invoiceWithTotals = computed(() => {
    const invoice = this.invoiceSignal();
    if (!invoice) return null;

    // Map the products to include the calculated total
    const enhancedProducts = invoice.products.map((product: Product) => {
        const tp = product?.tp || 0;
        const vat = product?.vat || 0;
        const quantity = product?.quantity || 0;

        return {
            ...product,
            total: quantity * (tp + vat)
        };
    });

    // Return the new object structure
    return {
        ...invoice,
        products: enhancedProducts
    };
});

  calculateProductTotal(product: any): number {
    const quantity = product?.quantity || 0;
    const price = product?.price || 0;
    const tp = product?.tp || 0;
    const vat = product?.vat || 0;
	product
    return quantity * (tp + vat);
  }

  updateInvoice() {
    let drawerRef = this.drawerService.create({
      nzTitle: 'New Invoice',
      nzClosable: true,
      nzMaskClosable: false,
      nzWidth: '100%',
      nzWrapClassName: 'full-drawer',
      // nzSize: 'large',
      nzContent: NewInvoiceComponent,
      nzData: { invoice: this.invoiceSignal() },
    });
  }

  async deleteInvoice() {
    const ok = await this.commonService.showConfirmModal(
      'Are you sure, you want to delete this invoice?'
    );

    if (!ok) return;

    this.commonService.presentLoading();
    this.invoiceStore.deleteInvoice(this.invoiceSignal()?._id as string);
    this.drawerRef.close();
  }

  print() {
    window.print();
  }

  printInvoice() {
    const doc = new jsPDF();

    // Add Company Logo Before Business Info
    const logo = new Image();
    logo.src = 'assets/img/company_logo.jpeg';

    logo.onload = () => {
      doc.addImage(logo, 'JPEG', 15, 8, 40, 40);

      // Business Info
      doc.setFontSize(14);
      doc.text(this.business?.name || 'Business Name', 60, 20);
      doc.setFontSize(10);
      doc.text(this.business?.address || 'Business Address', 60, 30);
      doc.text(`Phone: ${this.business?.contact || 'N/A'}`, 60, 40);

      // Invoice Details
      doc.setFontSize(12);
      doc.text(`Invoice #: ${this.invoiceSignal()?.sn || 'N/A'}`, 140, 20);
      doc.text(`Date: ${this.date}`, 140, 30);
      doc.text(`Status: ${this.invoiceSignal()?.status || 'N/A'}`, 140, 40);

      // Line Separator
      doc.line(15, 50, 195, 50);

      // Customer Details
      doc.text(`Customer code: #${this.invoiceSignal()?.customer?.sn || 'N/A'}`, 15, 55);
      doc.text(`Customer: ${this.invoiceSignal()?.customer?.name || 'N/A'}`, 15, 60);
      if (this.invoiceSignal()?.customer?.contacts) {
        doc.text(`Phone: ${this.invoiceSignal()?.customer.contacts}`, 15, 70);
      }
      if (this.invoiceSignal()?.customer?.address) {
        doc.text(`Address: ${this.invoiceSignal()?.customer.address}`, 15, 80);
      }

      // Generate Table of Products
      autoTable(doc, {
        startY: 90,
        head: [['Product Name', 'Quantity', 'TP (/=)', 'VAT (/=)', 'Bonus Qty' ,'Total (/=)']],
        body: this.invoiceSignal()?.products.map(product => [
          product.name,
          product.quantity,
          product?.tp.toFixed(2),
          product?.vat.toFixed(2),
          product?.bonus,
          (product.quantity * (product?.tp + product?.vat)).toFixed(2),
        ]),
        theme: 'plain',
        margin: { top: 10 },
      });

      // Calculate & Display Total
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      // doc.text(`Subtotal: ${this.subTotalAmount.toFixed(2)}/=`, 140, finalY + 10);
      // doc.text(`Discount: ${this.invoiceSignal().discount || 0}%`, 140, finalY + 20);
      doc.text(`Total Amount: ${this.invoiceSignal()?.totalAmount.toFixed(2)}/=`, 140, finalY + 10);

      // Signature Section with equal spacing and line lengths
      const signatureY = finalY + 50;
      const pageWidth = 210; // A4 width in mm
      const margin = 20;
      const signatureWidth = 50;
      const spacing = (pageWidth - 2 * margin - 3 * signatureWidth) / 2;

      const x1 = margin;
      const x2 = margin + signatureWidth + spacing;
      const x3 = margin + 2 * (signatureWidth + spacing);

      // Draw signature lines with equal length
      doc.line(x1, signatureY, x1 + signatureWidth, signatureY);
      doc.line(x2, signatureY, x2 + signatureWidth, signatureY);
      doc.line(x3, signatureY, x3 + signatureWidth, signatureY);

      // Add signature labels centered under each line
      doc.text('Customer Signature', x1 + (signatureWidth/2) - 20, signatureY + 10);
      doc.text('Depo In-Charge', x2 + (signatureWidth/2) - 15, signatureY + 10);
      doc.text('Authorized By', x3 + (signatureWidth/2) - 15, signatureY + 10);

      // Save or Print PDF
      doc.autoPrint();
      window.open(doc.output('bloburl'), '_blank');
    };
  }

  async showLogs() {
    const { LogComponent } = await import('src/app/common-component/log/log.component');
    this.drawerService.create({
      nzTitle: 'Activity Logs',
      nzWidth: '100%',
      nzWrapClassName: 'full-drawer',
      nzContent: LogComponent,
      nzData: {
        logs: this.invoiceSignal()?.activity_log,
      },
    });
  }


  ngOnDestroy() {}
}
