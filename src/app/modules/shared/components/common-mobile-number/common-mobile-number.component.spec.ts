import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonMobileNumberComponent } from './common-mobile-number.component';

describe('CommonMobileNumberComponent', () => {
  let component: CommonMobileNumberComponent;
  let fixture: ComponentFixture<CommonMobileNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonMobileNumberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonMobileNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
