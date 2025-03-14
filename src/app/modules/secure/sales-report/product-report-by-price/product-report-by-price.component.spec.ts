import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductReportByPriceComponent } from './product-report-by-price.component';

describe('ProductReportByPriceComponent', () => {
  let component: ProductReportByPriceComponent;
  let fixture: ComponentFixture<ProductReportByPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductReportByPriceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductReportByPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
