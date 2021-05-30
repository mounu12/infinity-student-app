import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeginWalkthroughComponent } from './begin-walkthrough.component';

describe('BeginWalkthroughComponent', () => {
  let component: BeginWalkthroughComponent;
  let fixture: ComponentFixture<BeginWalkthroughComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeginWalkthroughComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeginWalkthroughComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
