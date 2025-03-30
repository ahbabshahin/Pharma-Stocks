import { Component } from '@angular/core';
import { Business } from '../../../../store/models/business.model';
import { Customer } from '../../../../store/models/customer.model';
import { Invoice } from '../../../../store/models/invoice.model';
import { CommonService } from '../../../../service/common/common.service';
import { NewInvoiceComponent } from '../new-invoice/new-invoice.component';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { InvoiceStoreService } from '../../../../service/invoice/invoice-store.service';
import { CustomerStoreService } from '../../../../service/customer/customer-store.service';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { BusinessService } from '../../../../service/business/business.service';
import { AuthStoreService } from '../../../../service/auth/auth-store.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrl: './view-invoice.component.scss',
})
export class ViewInvoiceComponent {
  subs = new SubSink();
  invoice: Invoice;
  business: Business;
  customer: Customer;
  invoiceNumber: number;
  date: string;
  invoiceStatus: string;
  products: any;
  discount: number;
  totalAmount: number;
  isAdmin: boolean = false;

  constructor(
    private commonService: CommonService,
    private drawerService: NzDrawerService,
    private invoiceStore: InvoiceStoreService,
    private customerStore: CustomerStoreService,
    private businessService: BusinessService,
    private authStore: AuthStoreService,
    private drawerRef: NzDrawerRef,
    private datePipe: DatePipe,
  ) {}

  ngOnInit() {
    this.initialize();
  }

  async initialize() {
    await this.isAdminUser();
    this.getBusiness();
    this.getCustomers();
    this.date = this.datePipe.transform(this.invoice.createdAt, 'dd-MM-yyyy') as string;
  }

  getBusiness() {
    let business = this.businessService.getBusiness();
    if (business) this.business = business;
  }

  async isAdminUser() {
    console.log('admin');
    this.isAdmin = await this.authStore.isAdminUser();
    console.log('this.isAdmin: ', this.isAdmin);
  }

  calculateProductTotal(product: any): number {
    const quantity = product?.quantity || 0;
    const price = product?.price || 0;
    return quantity * price;
  }

  get subTotalAmount(): number {
    return this.invoice?.products.reduce((total, product) => {
      return total + this.calculateProductTotal(product);
    }, 0);
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
      nzData: { invoice: this.invoice },
    });

    this.subs.sink = drawerRef.afterClose.subscribe((invoice: Invoice) => {
      if (invoice) {
        this.invoice = invoice;
      }
    });
  }

  getCustomers() {
    this.subs.sink = this.customerStore.getCustomers().subscribe({
      next: (customers: Customer[]) => {
        console.log('res: ', customers);
        if (customers?.length)
          this.customer = customers.find(
            (item) => item?._id === this.invoice?.customer
          ) as Customer;
      },
      error: () => {
        console.log('error');
      },
    });
  }

  async deleteInvoice() {
    const ok = await this.commonService.showConfirmModal(
      'Are you sure, you want to delete this invoice?'
    );

    if (!ok) return;

    this.commonService.presentLoading();
    this.invoiceStore.deleteInvoice(this.invoice?._id as string);
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
      doc.text(`Invoice #: ${this.invoice?.sn || 'N/A'}`, 140, 20);
      doc.text(`Date: ${this.date}`, 140, 30);
      doc.text(`Status: ${this.invoice?.status || 'N/A'}`, 140, 40);

      // Line Separator
      doc.line(15, 50, 195, 50);

      // Customer Details
      doc.text(`Customer code: #${this.customer?.sn || 'N/A'}`, 15, 55);
      doc.text(`Customer: ${this.customer?.name || 'N/A'}`, 15, 60);
      if (this.customer?.contacts) {
        doc.text(`Phone: ${this.customer.contacts}`, 15, 70);
      }
      if (this.customer?.address) {
        doc.text(`Address: ${this.customer.address}`, 15, 80);
      }

      // Generate Table of Products
      autoTable(doc, {
        startY: 90,
        head: [['Product Name', 'Quantity', 'Price (/=)', 'Total (/=)']],
        body: this.invoice?.products.map(product => [
          product.name,
          product.quantity,
          product.price.toFixed(2),
          (product.quantity * product.price).toFixed(2),
        ]),
        theme: 'plain',
        margin: { top: 10 },
      });

      // Calculate & Display Total
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.text(`Subtotal: ${this.subTotalAmount.toFixed(2)}/=`, 140, finalY + 10);
      doc.text(`Discount: ${this.invoice.discount || 0}%`, 140, finalY + 20);
      doc.text(`Total Amount: ${this.invoice?.totalAmount.toFixed(2)}/=`, 140, finalY + 30);

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
    const { LogComponent } = await import('../../../../common-component/log/log.component');
    this.drawerService.create({
      nzTitle: 'Activity Logs',
      nzWidth: '100%',
      nzWrapClassName: 'full-drawer',
      nzContent: LogComponent,
      nzData: {
        logs: this.invoice?.activity_log,
      },
    });
  }


  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
