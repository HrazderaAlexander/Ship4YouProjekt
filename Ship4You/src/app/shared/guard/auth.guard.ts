import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from "../../shared/services/auth.service";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  
  /**
   * 
   * @param authService -> Auth methods
   * @param router -> To navigate
   */
  constructor(
    public authService: AuthService,
    public router: Router
  ){ }

  /**
   * If someone is logged in you will get to sign in
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(!this.authService.isLoggedIn) {
      this.router.navigate(['dashboard']);
    }
    return true;
  }

}