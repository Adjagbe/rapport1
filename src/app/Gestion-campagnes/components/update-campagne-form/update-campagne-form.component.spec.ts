import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCampagneFormComponent } from './update-campagne-form.component';

describe('UpdateCampagneFormComponent', () => {
  let component: UpdateCampagneFormComponent;
  let fixture: ComponentFixture<UpdateCampagneFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCampagneFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateCampagneFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should allow application modification for DESACTIVE status campaigns', () => {
    // Simuler une campagne avec le statut DESACTIVE
    component.campagneToUpdate = {
      status: 'DESACTIVE',
      idCampaign: 1,
      name: 'Test Campaign',
      startDate: '2024-01-01',
      estimatedEndDate: '2024-12-31',
    };

    // Déclencher ngOnInit
    component.ngOnInit();

    // Vérifier que les applications sont modifiables
    expect(component.readonlyApplications).toBeFalse();
    expect(component.readonlyNameAndStart).toBeTrue(); // Nom et date de début restent en lecture seule
  });

  it('should keep applications readonly for ACTIVE status campaigns', () => {
    // Simuler une campagne avec le statut ACTIVE
    component.campagneToUpdate = {
      status: 'ACTIVE',
      idCampaign: 1,
      name: 'Test Campaign',
      startDate: '2024-01-01',
      estimatedEndDate: '2024-12-31',
    };

    // Déclencher ngOnInit
    component.ngOnInit();

    // Vérifier que les applications sont en lecture seule
    expect(component.readonlyApplications).toBeTrue();
    expect(component.readonlyNameAndStart).toBeTrue();
  });

  it('should keep applications readonly for TERMINATE status campaigns', () => {
    // Simuler une campagne avec le statut TERMINATE
    component.campagneToUpdate = {
      status: 'TERMINATE',
      idCampaign: 1,
      name: 'Test Campaign',
      startDate: '2024-01-01',
      estimatedEndDate: '2024-12-31',
    };

    // Déclencher ngOnInit
    component.ngOnInit();

    // Vérifier que les applications sont en lecture seule
    expect(component.readonlyApplications).toBeTrue();
    expect(component.readonlyNameAndStart).toBeTrue();
  });
});
