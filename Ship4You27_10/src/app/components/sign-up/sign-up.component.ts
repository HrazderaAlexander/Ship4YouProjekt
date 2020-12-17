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
    public authService: AuthService, public dialogRef: MatDialogRef<SignUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onDismiss(): void {
    this.dialogRef.close(true);
    this.authService.GoogleAuth();
  }

  onSignUp(email:string, password:string): void{
    this.authService.SignUp(email, password);
    this.dialogRef.close(true);
  }
}