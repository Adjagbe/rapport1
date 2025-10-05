import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionReponseManageComponent } from './gestion-reponse-manage.component';

describe('GestionReponseManageComponent', () => {
  let component: GestionReponseManageComponent;
  let fixture: ComponentFixture<GestionReponseManageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GestionReponseManageComponent]
    });
    fixture = TestBed.createComponent(GestionReponseManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
