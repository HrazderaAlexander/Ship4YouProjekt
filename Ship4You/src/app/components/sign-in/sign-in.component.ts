import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from "../../shared/services/auth.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})

export class SignInComponent {

  /**
   * 
   * @param authService 
   * @param router 
   * @param dialogRef 
   * @param data 
   */
  constructor(
    public authService: AuthService, public router:Router, public dialogRef: MatDialogRef<SignInComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  /**
   * Close dialog
   */
  onDismiss(): void {
    /**
     * Close dialog
     */
    this.dialogRef.close(true);
    /**
     * Login
     */
    this.authService.GoogleAuth();
  }

  /**
   * Methode onForgotPassword()
   */
  onForgotPassword():void{
    /**
     * Close dialog
     */
    this.dialogRef.close(true);

    /**
     * Navigate to forgot password page
     */
    this.router.navigateByUrl('/forgot-password');
  }
}