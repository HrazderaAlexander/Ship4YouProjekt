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

  constructor(
    public authService: AuthService, public router:Router, public dialogRef: MatDialogRef<SignInComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onDismiss(): void {
    this.dialogRef.close(true);
    this.authService.GoogleAuth();
  }

  onForgotPassword():void{
    this.dialogRef.close(true);
    this.router.navigateByUrl('/forgot-password');
  }
}