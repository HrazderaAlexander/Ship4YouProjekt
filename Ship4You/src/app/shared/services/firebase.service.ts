import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable()
export class FirebaseService {

  /**
   * All data
   */
  tests: Observable<unknown[]>;

  /**
   * 
   * @param afs -> Angular fire store
   */
  constructor( private afs: AngularFirestore ) { }

  /**
   * Mult Picture upload
   */
  getTests() {
    this.tests = this.afs.collection(localStorage.getItem("createBoatId")+"Mult").valueChanges();
    return this.tests;
  }

  /**
   * Mult feedback picture upload
   */
  getTestFeedback(name){
    this.tests = this.afs.collection(localStorage.getItem("feedbackBoatId")+"MultFeedback" + name).valueChanges();
    return this.tests;
  }

  /**
   * Create boat
   */
  getTestCreate(){
    this.tests = this.afs.collection("test76").valueChanges();
    return this.tests;
  }

  /**
   * Add document
   */
  getDocumentsCreate(){
    this.tests = this.afs.collection("documentUpload").valueChanges();
    return this.tests;
  }
}
