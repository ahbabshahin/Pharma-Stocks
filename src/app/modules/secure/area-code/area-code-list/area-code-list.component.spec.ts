import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaCodeListComponent } from './area-code-list.component';

describe('AreaCodeListComponent', () => {
  let component: AreaCodeListComponent;
  let fixture: ComponentFixture<AreaCodeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaCodeListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AreaCodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
