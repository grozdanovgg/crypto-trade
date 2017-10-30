import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyAnalyticsComponent } from './currency-analytics.component';

describe('CurrencyAnalyticsComponent', () => {
  let component: CurrencyAnalyticsComponent;
  let fixture: ComponentFixture<CurrencyAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrencyAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
