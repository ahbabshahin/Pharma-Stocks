import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SidebarComponent } from './sidebar.component';

const routes: Routes = [
  {
    path: '',
    component: SidebarComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'stocks',
        loadChildren: () =>
          import('../stocks/stocks.module').then((m) => m.StocksModule),
      },
      {
        path: 'invoice',
        loadChildren: () =>
          import('../invoice/invoice.module').then((m) => m.InvoiceModule),
      },
      {
        path: 'customer',
        loadChildren: () =>
          import('../customer/customer.module').then((m) => m.CustomerModule),
      },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Default route
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SidebarRoutingModule {}
