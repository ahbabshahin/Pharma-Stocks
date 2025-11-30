import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Subject, takeUntil } from 'rxjs';
import { NoDataComponent } from 'src/app/common-component/no-data/no-data.component';
import { AreaCodeStoreService } from 'src/app/service/area-code/area-code-store.service';
import { AreaCode } from 'src/app/store/models/area-code.model';
import { NzColorPickerModule } from 'ng-zorro-antd/color-picker';
import { FormsModule } from '@angular/forms';
import { CommonService } from 'src/app/service/common/common.service';
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
	@Output() updateArea: EventEmitter<AreaCode> = new EventEmitter();
	constructor(
		private areaCodeStore: AreaCodeStoreService,
		private commonService: CommonService,
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

	updateAreaCode(area: AreaCode){
		this.updateArea.emit(area);
	}

	async deleteAreaCode(area: AreaCode){
		const { _id: id, code } = area;
		const ok = await this.commonService.showConfirmModal(
			`Are you sure you want to delete this area code: ${code}?`
		);

		if (!ok) return;

		this.commonService.presentLoading();
		this.areaCodeStore.deleteAreaCode(id as string);
	}

	ngOnDestroy(){
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}
