import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from "../../shared/services/auth.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent {

  constructor(
    public authService: AuthService, public dialogRef: MatDialogRef<SignUpComponent>, @Inject(MAT_DIALOG_DATA) public data: any
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
     * sign up with google
     */
    this.authService.GoogleAuth();
  }

  /**
   * Methode to signUp
   * 
   * @param email -> of the suer
   * @param password -> of the user
   * @param username -> of the user
   */
  onSignUp(email:string, password:string, username:string): void{
    /**
     * Calls authService.SignUp methode
     */
    this.authService.SignUp(email, password, username);

    /**
     * Close dialog
     */
    this.dialogRef.close(true);
  }
}
