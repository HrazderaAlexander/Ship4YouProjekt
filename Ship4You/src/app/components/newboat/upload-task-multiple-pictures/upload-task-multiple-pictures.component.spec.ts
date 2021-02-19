import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UploadTaskMultiplePicturesComponent } from './upload-task-multiple-pictures.component';

describe('UploadTaskMultiplePicturesComponent', () => {
  let component: UploadTaskMultiplePicturesComponent;
  let fixture: ComponentFixture<UploadTaskMultiplePicturesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadTaskMultiplePicturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadTaskMultiplePicturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
