import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Subject, takeUntil } from 'rxjs';
import { NoDataComponent } from 'src/app/common-component/no-data/no-data.component';
import { AreaCodeStoreService } from 'src/app/service/area-code/area-code-store.service';
import { AreaCode } from 'src/app/store/models/area-code.model';
import { NzColorPickerModule } from 'ng-zorro-antd/color-picker';
import { FormsModule } from '@angular/forms';
type ComponentState = {
	codes: AreaCode[];
}
@Component({
	standalone: true,
	selector: 'app-area-code-list',
	templateUrl: './area-code-list.component.html',
	styleUrl: './area-code-list.component.scss',
	imports: [
		CommonModule,
		FormsModule,
		NoDataComponent,

		NzIconModule,
		NzButtonModule,
		NzColorPickerModule,
	],
})
export class AreaCodeListComponent {
	unsubscribe$ = new Subject<void>();
	componentState: ComponentState;
	constructor(
		private areaCodeStore: AreaCodeStoreService,
	) {}

	ngOnInit(){
		this.initialize();
	}

	initialize(){
		this.componentState = {
			...this.componentState,
			codes: [],
		}
		this.getAreaCodes();
	}

	getAreaCodes(){
		const { getAllAreaCodes } = this.areaCodeStore;

		getAllAreaCodes().pipe(takeUntil(this.unsubscribe$)).subscribe({
			next: (res: AreaCode[]) => {
				if(res?.length){
					this.componentState = {
						...this.componentState,
						codes: res
					}
				}
			},
			error: (error) => {}
		});
		// return this.areaCodeStore.areaCodes;
	}

	ngOnDestroy(){
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}
