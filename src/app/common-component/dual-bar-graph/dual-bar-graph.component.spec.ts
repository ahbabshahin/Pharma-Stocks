import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DualBarGraphComponent } from './dual-bar-graph.component';

describe('DualBarGraphComponent', () => {
  let component: DualBarGraphComponent;
  let fixture: ComponentFixture<DualBarGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DualBarGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DualBarGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
