import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterOutlet } from '@angular/router';
import { SidebarRoutingModule } from './sidebar-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule, RouterOutlet, SidebarRoutingModule],
})
export class SidebarModule {}
