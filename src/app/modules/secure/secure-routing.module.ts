import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecureComponent } from './secure.component';
import { SidebarComponent } from '../../common-component/sidebar/sidebar.component';
import { AuthGuard } from '../../guard/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { AdminGuard } from '../../guard/admin.guard';
import { NotAuthorizedComponent } from '../../common-component/not-authorized/not-authorized.component';

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
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'not-authorized',
        component: NotAuthorizedComponent,
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
