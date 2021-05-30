import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionAnswerSheetComponent } from './solution-answer-sheet.component';

describe('SolutionAnswerSheetComponent', () => {
  let component: SolutionAnswerSheetComponent;
  let fixture: ComponentFixture<SolutionAnswerSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolutionAnswerSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionAnswerSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
