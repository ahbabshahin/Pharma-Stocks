import { Injectable } from '@angular/core';
import { BusinessService } from '../business/business.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice } from 'src/app/store/models/invoice.model';
import { Customer } from 'src/app/store/models/customer.model';
import { AreaCode } from 'src/app/store/models/area-code.model';
import { Business } from 'src/app/store/models/business.model';
import { DatePipe } from '@angular/common';

@Injectable()
export class InvoiceService {
	constructor(
		private businessService: BusinessService,
		private datePipe: DatePipe,
	) {}

	formatDate(date: string) {
		return this.datePipe.transform(date, 'dd-MM-yyyy');
	}
	getBusiness() {
		let business = this.businessService.getBusiness();
		// if (business) this.business = business;
	}

	private loadImage(src: string): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.src = src;
			img.onload = () => resolve(img);
			img.onerror = reject;
		});
	}

	printInvoicesBulk(invoices: Invoice<Customer<AreaCode>>[]) {
		this.generateBulkPDF(invoices);
	}

	async generateBulkPDF(invoices: Invoice<Customer<AreaCode>>[]) {
		const doc = new jsPDF();

		// Load logo once
		const logo = await this.loadImage('assets/img/company_logo.jpeg');
		const business = this.businessService.getBusiness();
		invoices.forEach((invoice, index) => {
			if (index > 0) {
				doc.addPage();
			}

			this.renderInvoice(doc, invoice, logo, business);
		});

		doc.autoPrint();
		window.open(doc.output('bloburl'), '_blank');
	}

	private renderInvoice(
		doc: jsPDF,
		invoice: Invoice<Customer<AreaCode>>,
		logo: HTMLImageElement,
		business: Business,
	) {
		// Logo
		doc.addImage(logo, 'JPEG', 15, 8, 40, 40);

		// Business Info
		doc.setFontSize(14);
		doc.text(business?.name || 'Business Name', 60, 20);
		doc.setFontSize(10);
		doc.text(business?.address || 'Business Address', 60, 30);
		doc.text(`Phone: ${business?.contact || 'N/A'}`, 60, 40);

		// Invoice Details
		doc.setFontSize(12);
		doc.text(`Invoice #: ${invoice?.sn || 'N/A'}`, 140, 20);
		doc.text(
			`Date: ${this.formatDate(invoice?.createdAt as string)}`,
			140,
			30,
		);
		doc.text(`Status: ${invoice?.status || 'N/A'}`, 140, 40);

		// Separator
		doc.line(15, 50, 195, 50);

		// Customer Info
		doc.text(`Customer code: #${invoice?.customer?.sn || 'N/A'}`, 15, 55);
		doc.text(`Customer: ${invoice?.customer?.name || 'N/A'}`, 15, 60);

		if (invoice?.customer?.contacts) {
			doc.text(`Phone: ${invoice.customer.contacts}`, 15, 70);
		}

		if (invoice?.customer?.address) {
			doc.text(`Address: ${invoice.customer.address}`, 15, 80);
		}

		// Product Table
		autoTable(doc, {
			startY: 90,
			head: [
				[
					'Product Name',
					'Quantity',
					'TP (/=)',
					'VAT (/=)',
					'Bonus Qty',
					'Total (/=)',
				],
			],
			body: invoice?.products?.map((p) => [
				p?.name,
				p?.quantity,
				p?.tp?.toFixed(2),
				p?.vat?.toFixed(2),
				p?.bonus,
				(p?.quantity * (p?.tp + p?.vat))?.toFixed(2),
			]),
			theme: 'plain',
		});

		// Total
		const finalY = (doc as any).lastAutoTable.finalY + 10;
		doc.text(
			`Total Amount: ${invoice.totalAmount?.toFixed(2)}/=`,
			140,
			finalY,
		);

		// Signatures
		this.renderSignatures(doc, finalY + 50);
	}

	private renderSignatures(doc: jsPDF, y: number) {
		const pageWidth = 210;
		const margin = 20;
		const width = 50;
		const spacing = (pageWidth - 2 * margin - 3 * width) / 2;

		const x1 = margin;
		const x2 = margin + width + spacing;
		const x3 = margin + 2 * (width + spacing);

		doc.line(x1, y, x1 + width, y);
		doc.line(x2, y, x2 + width, y);
		doc.line(x3, y, x3 + width, y);

		doc.text('Customer Signature', x1 + 5, y + 10);
		doc.text('Depo In-Charge', x2 + 8, y + 10);
		doc.text('Authorized By', x3 + 10, y + 10);
	}
}
