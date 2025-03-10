import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';
import { InvoiceApiService } from '../../service/invoice/invoice-api.service';
import { SubSink } from 'subsink';
import { SalesReportByPrice } from '../../store/models/invoice.model';
import { BarGraph } from '../../store/models/common.model';

@Component({
  selector: 'app-bar-graph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bar-graph.component.html',
  styleUrl: './bar-graph.component.scss',
  providers: [InvoiceApiService]
})
export class BarGraphComponent {
  subs = new SubSink();
  salesReportByPrice: SalesReportByPrice[] = [];
  barGraph: BarGraph;
  constructor(
    private invoiceApiService: InvoiceApiService,

  ) {}

  ngOnInit(){
    this.initialize();
  }

  initialize(){
    this.getSalesReportByPrice();
    this.initializeChart();
  }


  getSalesReportByPrice() {
    this.subs.sink = this.invoiceApiService
      .getSalesReportByPrice()
      .subscribe((res) => {
        this.salesReportByPrice = res;
        this.initializeChart();
      });
  }

  initializeChart(){
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.barGraph?.labels,
        datasets: [
          {
            label: this.barGraph?.datasets?.label,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: this.salesReportByPrice.map(
              () =>
                `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
                  Math.random() * 255
                )}, ${Math.floor(Math.random() * 255)})`
            ),
            data: this.barGraph?.datasets?.data,
          },
        ],
      },
    });
  }



  ngOnDestroy() {}
}
