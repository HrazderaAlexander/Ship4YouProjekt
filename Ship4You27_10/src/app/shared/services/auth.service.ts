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
  userData: any; // Speicher die Userdaten
  boatData: any; // Speichert Informationen über Boote

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,  
    public ngZone: NgZone // NgZone-Dienst zur Entfernung der Warnung außerhalb des Bereichs
  ) {    
    /* Speichert User-Daten in localStorage wenn er  
    eingeloggt ist sonst wird null gespeichert */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user; //user - Variable (Das File user.ts wird aufgerufen)
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('userUid', this.userData.uid);
        localStorage.setItem('userDisplayname', this.userData.displayName);
        console.log("User Uid: " + this.userData.uid);
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })
  }

  // Einloggen mit email/password
  SignIn(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then((result) => {
          this.ngZone.run(() => {
             this.router.navigate(['dashboard']);
           })
         this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  // Registrieren mit email/password
  SignUp(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.SendVerificationMail(); //ruft die Methode SendVerificationMail auf
        this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  // Das ist die Methode, die die Email sendet
  SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification()
    .then(() => {
      this.router.navigate(['verify-email-address']);
    })
  }

  // Passwort zurücksetzen
  ForgotPassword(passwordResetEmail) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail) //Methode wo die Email übergeben wird, an die der Link zum Passwort zurücksetzen gesendet wird.
    .then(() => {
      window.alert('Password reset email sent, check your inbox.'); //Fenster was angezeigt wird
    }).catch((error) => {
      window.alert(error)
    })
  }

  ChangeEmail(password:string, newEmail:string, email:string){
    firebase.auth()
      .signInWithEmailAndPassword(email, password).then(function(userCredential) {
        userCredential.user.updateEmail(newEmail)}).catch(function(err){
          alert("Error! Cannot change Email! Message: " + err);
        });
  }
  ChangePassword(oldPassword:string, newPassword:string, email:string){
    firebase.auth().signInWithEmailAndPassword(email, oldPassword).then(function(userCredential) {
      userCredential.user.updatePassword(newPassword)})
      .catch(function(err){
        alert("Error! Cannot change Password! Message: " + err);
      });
  }

  //   // Gibt True zurück, wenn der User eingeloggt und verifiziert ist
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  // Einloggen mittels GoogelAuth
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  // Methode die Oben aufgerufen wird
  //Popup wird geöffnet wen die Daten stimmen wird man weitergeleitet sonst error
  AuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
    .then((result) => {
       this.ngZone.run(() => {
          this.router.navigate(['dashboard']);//Navigation zur Seite
        })
      this.SetUserData(result.user);
    }).catch((error) => { 
      window.alert(error)//Error Meldung
    })
  }

  /* Einrichten von Benutzerdaten bei der Anmeldung mit Benutzername/Passwort
  Anmelden mit Sozialen Medien (Googel Account) 
  Jeder User bekommt eine Uid*/
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.email,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  //setze Boot in der Datenbank in boats/boat.uid
  SetBoatData(boat){
    const boatRef: AngularFirestoreDocument<any> = this.afs.doc(`boats/${boat.uid}`);
    const boatData: Boat = {
      id: boat.uid,
      name: boat.name,
      vermieter: boat.vermieter,
      schiffstyp: boat.schiffstyp
    }
    return boatRef.set(boatData, {
      merge: true
    })
  }

  // Der user wird aus dem LocalStorage gelöscht, weil er sich ausloggt
  //Wird zur Log in seite weitergeleitet
  SignOut() {
    this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('userUid');
      this.router.navigate(['dashboard']);
    })
    window.location.reload();
  }

  UserDetails(){
    this.router.navigate(['user-details']);
  }

  BoatDashboard(){
    this.router.navigate(['dashboard']);
  }

}