import { Injectable, NgZone } from '@angular/core';
import { User } from "../services/user";
import { Boat } from "../services/boat";
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  /**
   * Save the user data
   */
  userData: any;

  /**
   * Stores information about boats
   */
  boatData: any;

  /**
   * State of sending mail
   */
  verificationMailSent:boolean = false;

  /**
   * State if someone is logged in with google or not
   */
  googleLogin:boolean = false;

  /**
   * 
   * @param afs 
   * @param afAuth 
   * @param router 
   * @param ngZone 
   */
  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone out-of-range warning removal service
  ) {

    /**
     * Stores user data in localStorage if the user is logged in otherwise zero is stored
     */
    this.afAuth.authState.subscribe(user => {
      
      /**
       * Check if user is true
       */
      if (user) {

        /**
         * user - Variable (The file user.ts is called up)
         */
        this.userData = user;

        /**
         * Set user to localstorage
         */
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));

        /**
         * Set userUid to localstorage
         */
        localStorage.setItem('userUid', this.userData.uid);

        /**
         * Set userDisplayname to localstorage
         */
        localStorage.setItem('userDisplayname', this.userData.displayName);
      } else {
        /**
         * Set user to null in localStorage
         */
        localStorage.setItem('user', null);

        JSON.parse(localStorage.getItem('user'));
      }
    })
  }

  /**
   * Login with email/password
   * 
   * @param email from user
   * @param password from user
   */
  SignIn(email, password) {

    /**
     * Set localStorage
     */
    localStorage.setItem('googleSignIn', `${false}`);

    /**
     * Calls auth function
     */
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then((result) => {
          this.ngZone.run(() => {
            /**
             * Set user to localstorage
             */
            localStorage.setItem('user', JSON.stringify(this.getUserDetails(result.user.uid)));

            /**
             * Set userUid to localstorage
             */
            localStorage.setItem('userUid', result.user.uid);

            /**
             * Navigate to dashboard
             */
             this.router.navigate(['dashboard']);
           })
           /**
            * reload window
            */
         location.reload();
      }).catch((error) => {

        /**
         * Alert
         */
        window.alert(error.message)
      })
  }

  // Register with email/password
  SignUp(email, password, username) {

    /**
     * Call the auth methode
     */
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {

        /**
         * Calls sendVerification methode
         */
        this.SendVerificationMail();

        /**
         * Calls SetUserDataNormalLogin() methode
         */
        this.SetUserDataNormalLogin(result.user, username);
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  // This is the method that sends the email
  SendVerificationMail() {
    /**
     * Calls auth methode
     */
    return this.afAuth.auth.currentUser.sendEmailVerification()
    .then(() => {
      /**
       * Set bool to true
       */
      this.verificationMailSent = true;

      /**
       * Navigate to other page
       */
      this.router.navigate(['verify-email-address']);
    })
  }

  // Reset password
  ForgotPassword(passwordResetEmail) {

    /**
     * Method where the email is passed to which the password reset link is sent.
     */
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      /**
       * Window what is displayed
       */
      window.alert('Password reset email sent, check your inbox.');
    }).catch((error) => {

      /**
       * Error window
       */
      window.alert(error)
    })
  }

  /**
   * 
   * @param password from user
   * @param newEmail from user
   * @param email from user
   */
  ChangeEmail(password:string, newEmail:string, email:string){
    firebase.auth()
      .signInWithEmailAndPassword(email, password).then(function(userCredential) {
        userCredential.user.updateEmail(newEmail)}).catch(function(err){
          alert("Error! Cannot change Email! Message: " + err);
        });
  }

  /**
   * 
   * @param oldPassword from user
   * @param newPassword from user
   * @param email from user
   */
  ChangePassword(oldPassword:string, newPassword:string, email:string){
    /**
     * Call auth methode
     */
    firebase.auth().signInWithEmailAndPassword(email, oldPassword).then(function(userCredential) {
      /**
       * Update user credential
       */
      userCredential.user.updatePassword(newPassword)})
      .catch(function(err){
        /**
         * Show error message
         */
        alert("Error! Cannot change Password! Message: " + err);
      });
  }

  /**
   * Returns true if the user is logged in and verified.
   */
  get isLoggedIn(): boolean {
    /**
     * Set user from localStorage
     */
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  /**
   * Logging in using GoogelAuth
   */
  GoogleAuth() {
    /**
     * Set true to localStorage
     */
    localStorage.setItem('googleSignIn', `${true}`);

    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  /**
   * Get the details from the id
   * 
   * @param userId -> id from user
   */
  getUserDetails(userId:string){
    /**
     * Get userRef
     */
    const userRef: AngularFirestoreDocument<any> = this.afs.collection('users').doc(`${userId}`);
    
    /**
     * Return user details
     */
    userRef.get().subscribe(u => {return u});
  }

  /**
   * Method called above
   * 
   * Popup is opened if the data is correct you will be redirected otherwise error
   */
  AuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
    .then((result) => {
       this.ngZone.run(() => {

          /**
           * Navigation to dashboard
           */
          this.router.navigate(['dashboard']);
        })
      /**
       * Set user data
       */
      this.SetUserData(result.user);
      location.reload();
    }).catch((error) => {
      /**
       * Error message
       */
      window.alert(error)
    })
  }

  /**
   * Current user
   * 
   * Setting up user data when logging in with username/password, logging in with social media (Googel account), each user gets a Uid
   */
  SetUserData(user) {
    /**
     * Data from the user
     */
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    
    /**
     * Set data from user
     */
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    /**
     * Merge user data
     */
    return userRef.set(userData, {
      merge: true
    })
  }

  /**
   * 
   * @param user -> currnet user
   * @param username -> name
   */
  SetUserDataNormalLogin(user, username) {

    /**
     * Data from the user
     */
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    /**
     * Set data from user
     */
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: username,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }

    /**
     * Merge data
     */
    return userRef.set(userData, {
      merge: true
    })
  }

/**
 * The user is deleted from the LocalStorage because he logs out.
 * Will be redirected to the Log in page
 */
  SignOut() {
    /**
     * Calls auth methode
     */
    this.afAuth.auth.signOut().then(() => {

      /**
       * Remove local Storages
       */
      localStorage.removeItem('user');
      localStorage.removeItem('userUid');
      localStorage.removeItem('userDisplayName');
     
      /**
       * Navigate to dashbaord
       */
      this.router.navigateByUrl('/dashboard');
    })

    /**
     * Reload window
     */
    window.location.reload();
  }

  /**
   * UserDetails
   */
  UserDetails(){

    /**
     * Return to user details page
     */
    this.router.navigate(['user-details']);
  }

  BoatDashboard(){
    /**
     * Return to dashboard
     */
    this.router.navigate(['dashboard']);
  }

}
