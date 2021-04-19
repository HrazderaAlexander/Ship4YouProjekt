import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { Rating } from '../components/bewertung/rating';
import { BoatDTO } from '../components/boats/boat';
import { BoatService } from '../components/boats/boat.service';
import { FirebaseService } from '../shared/services/firebase.service';

export interface Test {
  imagenDestacada: string;
}

@Component({
  selector: 'app-create-feedback',
  templateUrl: './create-feedback.component.html',
  styleUrls: ['./create-feedback.component.scss']
})
export class CreateFeedbackComponent implements OnInit {

  boat: any = new BoatDTO;
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
  currentRate = 2;

  title: string;
  message: string;

  url:string = "";
  displayName:string ="";
  userImageDb:string="";

  //
  uploadPercent: Observable<number>;
  downloadURLObservable: Observable<string>;
  selectedFile: FileList | null;
  forma: FormGroup;
  tests: Observable<any[]>;

  newBoat: BoatDTO = new BoatDTO();

  tmp: string = "";
  //

  constructor(fb: FormBuilder, private boatService: BoatService, private fs: FirebaseService, public dialogRef: MatDialogRef<CreateFeedbackComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private router: Router, public afs: AngularFirestore, private datePipe:DatePipe,private storage: AngularFireStorage) {
    this.mydate = this.datePipe.transform(Date.now(), 'dd.MM.yyyy');
  }

  onConfirm(): void {
    this.dialogRef.close(false);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }

  ngOnInit() {
    const feedbackRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${localStorage.getItem('userUid')}`);

    feedbackRef.valueChanges().subscribe(x => this.url = x.photoURL);
    feedbackRef.valueChanges().subscribe(x => this.displayName = x.displayName);
    feedbackRef.valueChanges().subscribe(x => this.userImageDb = x.userImage);
    this.afs.collection(localStorage.getItem('boatForRatingBrand')+localStorage.getItem('boatForRatingName')).valueChanges().subscribe(v => this.ratingId = `${v.length}`);
    localStorage.setItem("feedbackBoatId", localStorage.getItem('boatForRatingBrand')+localStorage.getItem('boatForRatingName'));
    this.getCustomersList();

    this.newBoat = this.boatService.tmpBoat;
    console.log("NewBoatInit " + this.newBoat);
    this.mostrarImagenes();
  }

  //
  detectFiles(event) {
    this.selectedFile = event.target.files[0];
    this.uploadFile();
  }

  uploadUrlArray: Observable<String>[] = [];

  uploadFile() {
    console.log('TEST createBoatId: ', localStorage.getItem("feedbackBoatId"));
    const myTest = this.afs.collection(localStorage.getItem("feedbackBoatId")+"MultFeedback" + this.displayName).ref.doc();
    console.log(myTest.id)

    const file = this.selectedFile
    const filePath = `${myTest.id}/name1`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    this.uploadPercent = task.percentageChanges();

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().toPromise().then( (url) => {
          this.downloadURLObservable = url;
          this.uploadUrlArray.push(this.downloadURLObservable);

          myTest.set({
            imagenes : this.downloadURLObservable,
            myId : myTest.id
          })

          console.log( this.downloadURLObservable )
        }).catch(err=> { console.log(err) });
      })
    )
    .subscribe()
  }

  mostrarImagenes() {
    this.tests = this.fs.getTestFeedback(this.displayName);
  }
  //

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
    this.boatService.getBoatsList().snapshotChanges().pipe(
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
    console.log('USERIMAGE: ', this.userImageDb);
    const feedbackRef: AngularFirestoreDocument<any> = this.afs.doc(`${localStorage.getItem('boatForRatingBrand') + localStorage.getItem('boatForRatingName')}/${this.ratingId}`);

    const feedbackData: Rating = {
      idRating: this.ratingId.toLocaleString(),
      username: this.displayName,
      date: this.mydate,
      ratingStars: this.currentRate,
      text: this.feedback,
      picturesId: this.uploadUrlArray,
      userImage: this.url,
      userId: localStorage.getItem('userUid')
    }
    this.uploadUrlArray = [];
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
    this.boatService
      .updateBoat(this.boatKey, { allReatings: ratingBoat })
      .catch(err => console.log(err));
  }

  updateRatingSum(ratingDiv: any)
  {
    this.boatService
    .updateBoat(this.boatKey, { rating: ratingDiv })
    .catch(err => console.log(err));
  }

  addFeedback(){
    this.dialogRef.close(false);
    this.updateBoatStats();
    this.SetFeedbackData();
    this.router.navigateByUrl('/bewertung')
    //this.setAllRatingsToBoat();
  }

}

export class ConfirmDialogModel {
  constructor(public title: string, public message: string) {}
}
