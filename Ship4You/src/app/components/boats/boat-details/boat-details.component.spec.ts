import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BoatDetailsComponent } from './boat-details.component';

describe('CustomerDetailsComponent', () => {
  let component: BoatDetailsComponent;
  let fixture: ComponentFixture<BoatDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BoatDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoatDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
