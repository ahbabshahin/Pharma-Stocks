import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogoutGuard } from './guard/logout.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/auth' },
  {
    path: '',
    loadChildren: () =>
      import('./modules/secure/secure.module').then((m) => m.SecureModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
    canActivate:[LogoutGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
