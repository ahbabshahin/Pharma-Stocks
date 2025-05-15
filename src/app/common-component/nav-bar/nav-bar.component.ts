import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NzDrawerService } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
  ],
})
export class NavBarComponent {

  constructor(private drawerService: NzDrawerService){}

  async sidebar(){
    const { SidebarComponent} = await import('../sidebar/sidebar.component');
    this.drawerService.create({
        // nzTitle: 'New Invoice',
        nzClosable: true,
        nzMaskClosable: false,
        nzWrapClassName: 'md-drawer',
        // nzSize: 'large',
        nzContent: SidebarComponent,
      });
  }
}
