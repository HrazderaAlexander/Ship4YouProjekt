import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { Rating } from '../components/bewertung/rating';
import { Customer } from '../components/customers/customer';
import { CustomerService } from '../components/customers/customer.service';

@Component({
  selector: 'app-create-feedback',
  templateUrl: './create-feedback.component.html',
  styleUrls: ['./create-feedback.component.scss']
})
export class CreateFeedbackComponent implements OnInit {

  boat: any = new Customer;
  isHovering: boolean;
  ratingId:string="";
  mydate:string="";
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  customers: any = [];
  downloadURL: string;
  boatKey: string="";
  id:string = localStorage.getItem('boatForRating');
  ratingBoat: number[];
  dataLoaded: boolean = false;
  feedback:string="";
  currentRate = 6;

  title: string;
  message: string;

  url:string = "";
  displayName:string ="";

  constructor(public dialogRef: MatDialogRef<CreateFeedbackComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private customerService: CustomerService, private router: Router, public afs: AngularFirestore, private datePipe:DatePipe,private storage: AngularFireStorage) {
    this.mydate = this.datePipe.transform(Date.now(), 'dd.MM.yyyy');
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }

  ngOnInit() {
    const feedbackRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${localStorage.getItem('userUid')}`);

    feedbackRef.valueChanges().subscribe(x => this.url = x.photoURL);
    feedbackRef.valueChanges().subscribe(x => this.displayName = x.displayName);
    this.afs.collection(localStorage.getItem('boatForRatingBrand')+localStorage.getItem('boatForRatingName')).valueChanges().subscribe(v => this.ratingId = `${v.length}`);
    this.getCustomersList();
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


  getSingleBoat(): any{               //SingleCustomer

    var c = localStorage.getItem('numberOfBoats');
    if(!isNaN(Number(c))){
      var counter = Number(c);
      for(let i = 0; i < counter;i++){
        if(this.id == this.customers[i].key){
          this.boat = this.customers[i];
          console.log("BoatWithRating " + this.boat.allReatings);
          this.ratingBoat = this.boat.allReatings;
          this.boatKey = this.boat.key;
          console.log("BoatKey " + this.boatKey);
        }
      }
      return this.boat;
    }
    else{
      console.log("Not a number!");
      return null;
    }
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

    this.dataLoaded = true;
    console.log("Data" + this.dataLoaded);
  }

  SetFeedbackData() {
    const feedbackRef: AngularFirestoreDocument<any> = this.afs.doc(`${localStorage.getItem('boatForRatingBrand') + localStorage.getItem('boatForRatingName')}/${this.ratingId}`);

    const feedbackData: Rating = {
      idRating: this.ratingId.toLocaleString(),
      username: this.displayName,
      date: this.mydate,
      ratingStars: this.currentRate,
      text: this.feedback
    }
    return feedbackRef.set(feedbackData, {
      merge: true
    })
  }

  updateBoatStats(){
    this.ratingBoat.push(this.currentRate);
    this.updateRatingArray(this.ratingBoat);

    var sum = this.ratingBoat.reduce((acc, cur) => acc + cur, 0);
    console.log("Sum: " + sum);

    var div = sum/ (this.ratingBoat.length - 1);
    console.log("Div " + div);


    this.updateRatingSum(div)
  }

  updateRatingArray(ratingBoat: any) {
    this.customerService
      .updateCustomer(this.boatKey, { allReatings: ratingBoat })
      .catch(err => console.log(err));
  }

  updateRatingSum(ratingDiv: any)
  {
    this.customerService
    .updateCustomer(this.boatKey, { rating: ratingDiv })
    .catch(err => console.log(err));
  }

  addFeedback(){
    //this.setAllRatingsToBoat();
    this.dialogRef.close(true);
    this.updateBoatStats();
    this.SetFeedbackData();
    this.router.navigateByUrl('/dashboard')
  }

}

export class ConfirmDialogModel {
  constructor(public title: string, public message: string) {}
}
