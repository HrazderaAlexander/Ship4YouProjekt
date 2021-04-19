import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from "../../shared/services/auth.service";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SecureInnerPagesGuard implements CanActivate {

  /**
   * 
   * @param authService -> Auth methods
   * @param router -> to navigate
   */
  constructor(
    public authService: AuthService,
    public router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    /**
     * When you are logged in and want to leave the page via browser arrows
     * 
     * Check if user logged in
     */
    if(this.authService.isLoggedIn) { 
       window.alert("You are not allowed to access this URL!");
       this.router.navigate(['dashboard'])
    }
    return true;
  }

}