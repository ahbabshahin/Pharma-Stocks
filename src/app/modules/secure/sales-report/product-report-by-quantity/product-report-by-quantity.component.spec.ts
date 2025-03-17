import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductReportByQuantityComponent } from './product-report-by-quantity.component';

describe('ProductReportByQuantityComponent', () => {
  let component: ProductReportByQuantityComponent;
  let fixture: ComponentFixture<ProductReportByQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductReportByQuantityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductReportByQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
