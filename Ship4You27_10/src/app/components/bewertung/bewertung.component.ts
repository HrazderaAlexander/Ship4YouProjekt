import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Customer } from '../customers/customer';
import { CustomerService } from '../customers/customer.service';
import { Rating } from './rating';
import { DatePipe } from '@angular/common';
import { MaxLengthValidator } from '@angular/forms';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-bewertung',
  templateUrl: './bewertung.component.html',
  styleUrls: ['./bewertung.component.scss']
})
export class BewertungComponent implements OnInit {
  currentRate = 6;
  mydate:string="";
  customers: any = [];
  boat: any = new Customer;
  id:string = localStorage.getItem('boatForRating');
  feedback:string="";
  isChosen:boolean = false;
  newRating:Rating = new Rating();
  isHovering: boolean;

  //UploadTask
  //@Input() file: File;

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  //------------------

  constructor(private customerService: CustomerService, private storage: AngularFireStorage, public authService: AuthService, private datePipe:DatePipe, public afs: AngularFirestore, private router: Router ) { 
    this.mydate = this.datePipe.transform(Date.now(), 'dd.MM.yyyy');
  }

  files: File[] = [];

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
      //this.file = files.item(i);
      this.startUpload(files.item(i))
    }
    //if (this.file != null){
      //this.startUpload(file);
    //}
  }

  ngOnInit() {
    this.getCustomersList();
  }

  startUpload(file) {

    // The storage path
    const path = `test/${Date.now()}_${file.name}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    this.snapshot   = this.task.snapshotChanges().pipe(
      tap(console.log),
      // The file's download URL
      finalize( async() =>  {
        this.downloadURL = await ref.getDownloadURL().toPromise();

        this.afs.collection('files').add( { downloadURL: this.downloadURL, path });
      }),
    );
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

  getCustomersList() {
    this.customerService.getCustomersList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(customers => {
      this.customers = customers; 
      this.getSingleBoat();     
    });
  }

  getSingleBoat(): any{               //SingleCustomer
    
    var c = localStorage.getItem('numberOfBoats');
    if(!isNaN(Number(c))){
      var counter = Number(c);
      for(let i = 0; i < counter;i++){
        if(this.id == this.customers[i].key){
          this.boat = this.customers[i];
        }
      }
      return this.boat;  
    }
    else{
      console.log("Not a number!");
      return null;
    }
  }

  SetFeedbackData() {
    let ratingId = localStorage.getItem('boatForRatingBrand') + localStorage.getItem('boatForRatingName') + localStorage.getItem('userUid');

    const feedbackRef: AngularFirestoreDocument<any> = this.afs.doc(`feedback/${ratingId}`);

    const feedbackData: Rating = {
      idRating: ratingId,
      username: localStorage.getItem('userDisplayname'),
      date: this.mydate,
      ratingStars: this.currentRate,
      text: this.feedback
    }
    return feedbackRef.set(feedbackData, {
      merge: true
    })
  }

  addFeedback(){
    this.SetFeedbackData();
    this.router.navigateByUrl('/dashboard')
  }

  choosePhoto(){

  }

}
