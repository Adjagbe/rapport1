import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPreviewCardComponent } from './upload-preview-card.component';

describe('UploadPreviewCardComponent', () => {
  let component: UploadPreviewCardComponent;
  let fixture: ComponentFixture<UploadPreviewCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UploadPreviewCardComponent]
    });
    fixture = TestBed.createComponent(UploadPreviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
