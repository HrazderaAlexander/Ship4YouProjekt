import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../shared/services/auth.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent{

  /**
   * 
   * @param authService -> to use AuthService
   * @param router -> to switch page
   */
  constructor(public authService: AuthService, private router: Router) { }

  /**
   * 
   * @param passwordResetEmail -> passwort reset email
   */
  onSubmit(passwordResetEmail:string):void{
    this.authService.ForgotPassword(passwordResetEmail);
  }

  /**
   * Methode to go back to dashbaord
   */
  goToDashboard(){
    this.router.navigateByUrl("/dashboard");
  }
}