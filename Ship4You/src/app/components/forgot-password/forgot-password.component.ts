import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../shared/services/auth.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent implements OnInit {

  constructor(
    public authService: AuthService, private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit(passwordResetEmail:string):void{
    this.authService.ForgotPassword(passwordResetEmail);
  }

  goToDashboard(){
    this.router.navigateByUrl("/dashboard");
  }

}