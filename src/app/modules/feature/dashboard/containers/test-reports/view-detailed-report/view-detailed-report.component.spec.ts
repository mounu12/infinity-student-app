import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailedReportComponent } from './view-detailed-report.component';

describe('ViewDetailedReportComponent', () => {
  let component: ViewDetailedReportComponent;
  let fixture: ComponentFixture<ViewDetailedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDetailedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
