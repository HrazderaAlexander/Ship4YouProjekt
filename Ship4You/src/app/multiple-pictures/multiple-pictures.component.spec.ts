import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MultiplePicturesComponent } from './multiple-pictures.component';

describe('MultiplePicturesComponent', () => {
  let component: MultiplePicturesComponent;
  let fixture: ComponentFixture<MultiplePicturesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiplePicturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiplePicturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
