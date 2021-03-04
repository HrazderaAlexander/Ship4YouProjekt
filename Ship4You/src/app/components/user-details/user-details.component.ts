import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import { Router } from "@angular/router";
import { BoatDTO } from '../boats/boat';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  check = false;

  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    public afs: AngularFirestore
  ) {
   }

  userCustomers: BoatDTO[] = [];
  googleSignIn = localStorage.getItem('googleSignIn');
  user = JSON.parse(localStorage.getItem('user'));

  hide = true;
  hide2 = true;
  displayName:string="";
  oldUserpassword:string="";
  newPassword:string = "";

  ngOnInit()
  {
    const feedbackRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${localStorage.getItem('userUid')}`);

    feedbackRef.valueChanges().subscribe(x => this.url = x.photoURL);
    feedbackRef.valueChanges().subscribe(x => this.displayName = x.displayName);
      for(let i = 0; i < JSON.parse(localStorage.getItem('customerArray')).length; i++){
        console.log('customerArray: ' + JSON.parse(localStorage.getItem('customerArray'))[i]);

        if(JSON.parse(localStorage.getItem('customerArray'))[i].userId == localStorage.getItem('userUid')){
          this.userCustomers.push(JSON.parse(localStorage.getItem('customerArray'))[i]);
        }
      }
  }

  name = '';
  url;
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = (event.target as FileReader).result;  //event.target.result.toString();
      }
    }
  }
  public delete(){
    this.url = null;
  }

  onSave(){
    this.startLoading();
    if(this.oldUserpassword || this.newPassword)
      this.authService.ChangePassword(this.oldUserpassword,this.newPassword,this.user.email)

    const feedbackRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${localStorage.getItem('userUid')}`);

    feedbackRef.update({
      photoURL: this.url
    });
    setTimeout(()=>{
      location.reload();
    }, 4000);
  }

  startLoading(){
    this.check=true;
    console.log('check: ', this.check);
  }

  goToDashboard(){
    this.router.navigateByUrl("/dashboard");
  }
}
