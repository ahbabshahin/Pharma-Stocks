import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecureComponent } from './secure.component';
import { AuthGuard } from '../../guard/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { AdminGuard } from '../../guard/admin.guard';
import { NotAuthorizedComponent } from '../../common-component/not-authorized/not-authorized.component';
import { UserModule } from './user/user.module';

const routes: Routes = [
  {
    path: '',
    component: SecureComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'stocks',
        loadChildren: () =>
          import('./stocks/stocks.module').then((m) => m.StocksModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'invoice',
        loadChildren: () =>
          import('./invoice/invoice.module').then((m) => m.InvoiceModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'customer',
        loadChildren: () =>
          import('./customer/customer.module').then((m) => m.CustomerModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule),
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'not-authorized',
        component: NotAuthorizedComponent,
      },
      {
        path: 'sales-report',
        loadChildren: () =>
          import('./sales-report/sales-report.module').then(
            (m) => m.SalesReportModule
          ),
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'sold-products',
        loadChildren: () =>
          import('./sold-products/sold-products.module').then(
            (m) => m.SoldProductsModule
          ),
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'delivery',
        loadChildren: () =>
          import('./delivery/delivery.module').then(
            (m) => m.DeliveryModule
          ),
        canActivate: [AuthGuard, AdminGuard],
      },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Default route
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecureRoutingModule {}
