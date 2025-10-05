import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthorizationService } from '../Services/authorization/authorization.service';

@Directive({
  selector: '[HasPermission]',
  standalone: true
})
export class HasPermissionDirective {

  private permissionService = inject(AuthorizationService);

  constructor(private tpl: TemplateRef<any>, private vcr: ViewContainerRef) {}

  @Input() set HasPermission(code: string) {
    this.vcr.clear();
    if (this.permissionService.hasPermission(code)) {
      this.vcr.createEmbeddedView(this.tpl);
    }
  }
  

}
