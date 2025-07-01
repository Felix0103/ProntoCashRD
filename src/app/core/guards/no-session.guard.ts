import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoSessionGuard implements CanActivate {
  constructor( private authService: AuthService, private router: Router){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkCookieSession();
  }

  async checkCookieSession(): Promise<boolean> {
    try {
      const token  = await this.authService.getTokenAsync();
      if (token) {
        this.router.navigate(['/home']);
        return false;
      }
      return true;
    } catch (e) {

      return true
    }
  }

}
