import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateFeedbackComponent } from './create-feedback.component';

describe('CreateFeedbackComponent', () => {
  let component: CreateFeedbackComponent;
  let fixture: ComponentFixture<CreateFeedbackComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
