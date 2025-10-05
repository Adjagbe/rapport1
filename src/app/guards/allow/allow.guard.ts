import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthorizationService } from 'src/app/Core/Services/authorization/authorization.service';

export const allowGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const permissionService = inject(AuthorizationService);
 
    const requiredPermission = route.data['code'];
    if (permissionService.hasPermission(requiredPermission)) {
      return true;
    }else{
      router.navigate(['/dashboard']); // Redirection si pas la permission
      return false;
    }
    

};
