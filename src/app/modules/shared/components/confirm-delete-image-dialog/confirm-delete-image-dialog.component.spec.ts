import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteImageDialogComponent } from './confirm-delete-image-dialog.component';

describe('ConfirmDeleteImageDialogComponent', () => {
  let component: ConfirmDeleteImageDialogComponent;
  let fixture: ComponentFixture<ConfirmDeleteImageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteImageDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
