import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundHomepageComponent } from './background-homepage.component';

describe('BackgroundHomepageComponent', () => {
  let component: BackgroundHomepageComponent;
  let fixture: ComponentFixture<BackgroundHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackgroundHomepageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
