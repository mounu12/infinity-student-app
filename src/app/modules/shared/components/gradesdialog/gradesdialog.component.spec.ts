import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradesdialogComponent } from './gradesdialog.component';

describe('GradesdialogComponent', () => {
  let component: GradesdialogComponent;
  let fixture: ComponentFixture<GradesdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradesdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradesdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
