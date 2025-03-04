import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../service/common/common.service';
import { ActivityLog } from '../../store/models/common.model';
import { NoDataComponent } from '../no-data/no-data.component';



@Component({
  selector: 'app-log',
  standalone: true,
  imports: [CommonModule, NoDataComponent,],
  templateUrl: './log.component.html',
  styleUrl: './log.component.scss'
})
export class LogComponent implements OnInit {
  logs: ActivityLog[] = [];

  constructor(private commonService: CommonService) {}

  ngOnInit() {
    // Initialize logs array
  }

  ngOnDestroy() {
  }
}
