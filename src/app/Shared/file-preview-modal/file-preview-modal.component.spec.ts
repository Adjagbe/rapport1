import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilePreviewModalComponent } from './file-preview-modal.component';

describe('FilePreviewModalComponent', () => {
  let component: FilePreviewModalComponent;
  let fixture: ComponentFixture<FilePreviewModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FilePreviewModalComponent]
    });
    fixture = TestBed.createComponent(FilePreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
