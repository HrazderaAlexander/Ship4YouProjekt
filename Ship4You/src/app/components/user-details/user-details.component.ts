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
  /**
   * Set color for spinner
   */
  color: ThemePalette = 'primary';

  /**
   * Mode for spinner
   */
  mode: ProgressSpinnerMode = 'indeterminate';

  /**
   * Save the state of checking
   */
  check = false;

  /**
   * 
   * @param authService 
   * @param router 
   * @param ngZone 
   * @param afs 
   */
  constructor(public authService: AuthService, public router: Router, public ngZone: NgZone, public afs: AngularFirestore) {
  }

  /**
   * Save all userBoats 
   */
  userBoats: BoatDTO[] = [];

  /**
   * Save googleSign in from localstorage
   */
  googleSignIn = localStorage.getItem('googleSignIn');

  /**
   * Save user from localstorage
   */
  user = JSON.parse(localStorage.getItem('user'));

  /**
   * Set hide to true 
   */
  hide = true;

  /**
   * Set hide to false
   */
  hide2 = true;

  /**
   * Variable to save displayname
   */
  displayName:string="";

  /**
   * Variable to save old user pw
   */
  oldUserpassword:string="";

  /**
   * Variable to save new password
   */
  newPassword:string = "";

  /**
   * Will be called at first
   */
  ngOnInit()
  {
    /**
     * Save feedbacks from user
     */
    const feedbackRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${localStorage.getItem('userUid')}`);

    /**
     * Set picture url
     */
    feedbackRef.valueChanges().subscribe(x => this.url = x.photoURL);

    /**
     * Set display name
     */
    feedbackRef.valueChanges().subscribe(x => this.displayName = x.displayName);

    /**
     * Go trough all boats
     */
    for(let i = 0; i < JSON.parse(localStorage.getItem('customerArray')).length; i++){

      if(JSON.parse(localStorage.getItem('customerArray'))[i].userId == localStorage.getItem('userUid')){
        this.userBoats.push(JSON.parse(localStorage.getItem('customerArray'))[i]);
      }
    }
  }

  /**
   * Name of the file
   */
  name = '';
  /**
   * Url of the file
   */
  url;

  /**
   * 
   * @param event -> which file 
   */
  onSelectFile(event) {

    /**
     * Check if there are tarket files
     */
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        /**
         * Set url
         */
        this.url = (event.target as FileReader).result; 
      }
    }
  }

  /**
   * Methode to save user stats
   */
  onSave(){
    /**
     * Calls start methode
     */
    this.startLoading();
    
    /**
     * Check if user is not logged in with google
     */
    if(!this.googleSignIn){
      /**
       * check if they are not null
       */
      if(this.oldUserpassword || this.newPassword)
      this.authService.ChangePassword(this.oldUserpassword,this.newPassword,this.user.email) // send to authService
    }

    /**
     * get all from userId
     */
    const feedbackRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${localStorage.getItem('userUid')}`);

    /**
     * Update user picture
     */
    feedbackRef.update({
      photoURL: this.url
    });
    /**
     * Waiting timer for saving in db
     */
    setTimeout(()=>{
      /**
       * reload location
       */
      location.reload();
    }, 4000);
  }

  /**
   * Should the circle start?
   */
  startLoading(){
    /**
     * Check to true
     */
    this.check=true;
  }

  /**
   * Methode to navigate to dashboard
   */
  goToDashboard(){
    this.router.navigateByUrl("/dashboard");
  }
}
