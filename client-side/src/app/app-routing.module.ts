import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./secure/sidebar/sidebar.module').then((m) => m.SidebarModule),
  },
  { path: '', redirectTo: '/secure', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/secure' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
