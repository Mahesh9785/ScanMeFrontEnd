import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
export const SecondaryAuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);

  const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn) {
      router.navigate(['/home']);
      return false;
    }else{
      return true;
    }
}
