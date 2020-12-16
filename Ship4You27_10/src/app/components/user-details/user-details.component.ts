import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import { Router } from "@angular/router";


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone
  ) {
    this.userDisplayName = localStorage.getItem('userDisplayname');
   }

  userDisplayName: string;

  hide = true;
  hide2 = true;
  oldUserpassword:string="";
  newPassword:string = "";
  ngOnInit() { }

}
