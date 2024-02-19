import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
}
