import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductReportTableComponent } from './product-report-table.component';

describe('ProductReportTableComponent', () => {
  let component: ProductReportTableComponent;
  let fixture: ComponentFixture<ProductReportTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductReportTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductReportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
