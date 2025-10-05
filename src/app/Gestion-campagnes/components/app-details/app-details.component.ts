import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  Input,
  OnInit,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnGenericComponent } from 'src/app/Shared/Components/btn-generic/btn-generic.component';
import { ApplicationDetail } from 'src/app/Models/gestion-campagnes.model';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AdduserToAppFormComponent } from '../adduser-to-app-form/adduser-to-app-form.component';
import { HasPermissionDirective } from 'src/app/Core/hasPermission/has-permission.directive';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, BtnGenericComponent, HasPermissionDirective],
  templateUrl: './app-details.component.html',
  styleUrls: ['./app-details.component.scss'],
})
export class AppDetailsComponent implements AfterViewInit, OnInit, OnDestroy {
  #renderer = inject(Renderer2);
  #host = inject(ElementRef<HTMLElement>);
  #resizeObserver!: ResizeObserver;
  #route = inject(ActivatedRoute);

  #ngModal = inject(NgbModal);
  #modalRef: NgbModalRef | null = null;

  campagneId: number | null = null;
  querys$ = this.#route.queryParamMap.pipe(
    tap((querys) => {
      this.campagneId = +(querys.get('campagne') as string);
    })
  );

  @ViewChildren('appInfo') spans: ElementRef | null = null;
  @Input() appDetail: Omit<
    ApplicationDetail,
    'certifiedAccountsInApp' | 'uncertifiedAccountsInApp'
  > | null = null;
  @Input() hideActions: boolean = false;
  selectedFile: File | null = null;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Observe la largeur du host pour appliquer une classe quand < 305px
    this.#resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width < 305) {
          this.#renderer.addClass(this.#host.nativeElement, 'under-305');
        } else {
          this.#renderer.removeClass(this.#host.nativeElement, 'under-305');
        }
      }
    });
    this.#resizeObserver.observe(this.#host.nativeElement);
  }

  async addUsersToCampaignApplication(e: Event) {
    e.stopPropagation();
    this.#modalRef = this.#ngModal.open(AdduserToAppFormComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    if (this.#modalRef.componentInstance) {
      this.#modalRef.componentInstance.selectedAppId =
        this.appDetail?.applicationId;
      this.#modalRef.componentInstance.campagneId = this.campagneId;
      this.#modalRef.componentInstance.mode = 'ADD';
    }
  }

  async replaceUsersToCampaignApplication(e: Event) {
    e.stopPropagation();
    this.#modalRef = this.#ngModal.open(AdduserToAppFormComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    if (this.#modalRef.componentInstance) {
      this.#modalRef.componentInstance.selectedAppId =
        this.appDetail?.applicationId;
      this.#modalRef.componentInstance.campagneId = this.campagneId;
      this.#modalRef.componentInstance.mode = 'REPLACE';
    }
  }

  ngOnDestroy(): void {
    try {
      this.#resizeObserver?.disconnect();
    } catch {}
  }
}
