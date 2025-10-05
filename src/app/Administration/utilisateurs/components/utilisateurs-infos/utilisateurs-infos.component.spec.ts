import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateurInfosComponent } from './utilisateurs-infos.component';

describe('UtilisateurInfosComponent', () => {
  let component: UtilisateurInfosComponent;
  let fixture: ComponentFixture<UtilisateurInfosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UtilisateurInfosComponent]
    });
    fixture = TestBed.createComponent(UtilisateurInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
