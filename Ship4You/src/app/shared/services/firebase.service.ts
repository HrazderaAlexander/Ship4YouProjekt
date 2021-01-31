import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable()
export class FirebaseService {

  tests: Observable<any[]>;
  tmp: string = "";

  constructor( private afs: AngularFirestore ) { }

  getTests() {
    this.tests = this.afs.collection(localStorage.getItem("createBoatId")).valueChanges();
    return this.tests;
  }
}
