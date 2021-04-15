import { Rating } from './rating';
import { Component, OnInit } from '@angular/core';
import { count, map } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BoatDTO } from '../boats/boat';
import { BoatService } from '../boats/boat.service';
import { DatePipe } from '@angular/common';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { CreateFeedbackComponent } from 'src/app/create-feedback/create-feedback.component';
import { FirebaseService } from 'src/app/shared/services/firebase.service';
import { EditFeedbackComponent } from 'src/app/edit-feedback/edit-feedback.component';

@Component({
  selector: 'app-bewertung',
  templateUrl: './bewertung.component.html',
  styleUrls: ['./bewertung.component.scss']
})
export class BewertungComponent implements OnInit {
  currentRate = 6;
  mydate:string="";
  boats: any = [];
  boat: any = new BoatDTO;
  id:string = localStorage.getItem('boatForRating');
  feedback:string="";
  userId:string = localStorage.getItem('userUid');
  isChosen:boolean = false;
  isHovering: boolean;
  ratingId:string="";
  feedbackDb:any[] = [];
  feedbackByid:any = new Rating   ;
  feedbackRef: AngularFirestoreDocument<any>[] = [];
  feedbackRefById: AngularFirestoreDocument<any>;
  ratingBoat: number[];

  dataLoaded: boolean = false;

  clicks: number = 0;
  
  boatKey: string="";

  feedbackButtonPressed = false;

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  //------------------
  defaultElevation = 2;

  feedbackArray=[];
  currentPage = 1
  pageSizes = [4,10,50,100]
  feedbackArraySize = this.pageSizes[0];

  pageIsLoaded: boolean = false; //boolean if page is loaded
  nextPage: boolean = false; //is there a next Page
  behindPage: boolean = false; //is there a Page behind

  url:string = "";
  displayName:string ="";

  tests: Observable<any[]>;

  showNoResult:boolean=true;
  //------------------

  constructor(public dialog: MatDialog,private boatService: BoatService, public fs: FirebaseService, private storage: AngularFireStorage, public authService: AuthService, private datePipe:DatePipe, public afs: AngularFirestore, private router: Router ) {
    this.mydate = this.datePipe.transform(Date.now(), 'dd.MM.yyyy');
  }

  feedbackFunct(){
    this.feedbackArray = [];
    for (let i = 0; i < this.feedbackArraySize; i++){
      this.feedbackArray.push(i);
    }

  }

  mostrarImagenes(username:string) {
    this.tests = this.fs.getTestFeedback(username);
    console.log('tests: ', this.tests);
  }

  confirmDialog(): void {
    const dialogRef = this.dialog.open(CreateFeedbackComponent, {
      maxWidth: "400px"
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(!dialogResult){
       this.getFeedbackData();
      }
      this.showNoResult = false;
    });
  }
  confirmEditFeedbackDialog(): void {
    const dialogRef = this.dialog.open(EditFeedbackComponent, {
      maxWidth: "400px"
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(!dialogResult){
       this.getFeedbackData();
      }
      this.showNoResult = false;
    });
  }

  changePage(pageNum){
    if(pageNum>=1 && (this.feedbackDb.length-1)/this.feedbackArraySize) {
      this.currentPage = pageNum;

      if (pageNum == 1){
        this.behindPage = true;

      }

      if (this.nextPage == true){
        this.nextPage = false;
      }

    }

  }

  getMaxPage(){
    return Math.ceil((this.feedbackDb.length-1)/this.feedbackArraySize);
  }

  changeToLastPage(){
    this.currentPage =  this.getMaxPage()//Get Max
    this.nextPage = true;

    if (this.behindPage == true){
      this.behindPage = false;
    }
  }

  minusPage(minus) {
    if(this.currentPage-minus>=1 && this.currentPage-minus<=(this.feedbackDb.length-1)/this.feedbackArraySize) {
      this.currentPage = this.currentPage-minus

      if (this.currentPage == 1){ //currentPage = 1
        this.behindPage = true;
      }

      if (this.nextPage == true){
        this.nextPage = false;
      }

    }
  }

  plusPage(plus) {
    if(this.currentPage+plus>=1 && this.currentPage+plus<=Math.ceil((this.feedbackDb.length)/this.feedbackArraySize)) {
      this.currentPage = this.currentPage+plus;

      if (this.currentPage == this.getMaxPage()){
        this.nextPage = true;
      }

      if (this.behindPage == true){
        this.behindPage = false;
      }
    }
  }


  // Simulate click function
   clickButton() {
    document.getElementById('btn1').click();

  }

  //reload page

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
    this.afs.collection(localStorage.getItem('boatForRatingBrand')+localStorage.getItem('boatForRatingName')).valueChanges().subscribe(v => this.ratingId = `${v.length}`);
    localStorage.setItem("feedbackBoatId", localStorage.getItem('boatForRatingBrand')+localStorage.getItem('boatForRatingName'));
    console.log("FeedbackBoatId " + localStorage.getItem("feedbackBoatId"));
    this.getBoatsList();
    const feedbackRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${localStorage.getItem('userUid')}`);

    feedbackRef.valueChanges().subscribe(x => this.url = x.photoURL);
    feedbackRef.valueChanges().subscribe(x => this.displayName = x.displayName);

    this.feedbackFunct();
    this.behindPage = true;
    this.confirmDialog();
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

  getBoatsList() {
    this.boatService.getBoatsList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(boats => {
      this.boats = boats;
      this.getSingleBoat();
    });

    this.dataLoaded = true;
    console.log("Data" + this.dataLoaded);
  }

  getSingleBoat(): any{               //SingleCustomer

    var c = localStorage.getItem('numberOfBoats');
    if(!isNaN(Number(c))){
      var counter = Number(c);
      for(let i = 0; i < counter;i++){
        if(this.id == this.boats[i].key){
          this.boat = this.boats[i];
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

  tmp:number = 0;

  getFeedbackData() {
    for(let i =0; i < parseInt(this.ratingId); i++){
      this.feedbackRef[i] = this.afs.doc(`${localStorage.getItem('boatForRatingBrand') + localStorage.getItem('boatForRatingName')}/${i}`);
      this.feedbackRef[i].valueChanges().subscribe(item =>
        {
          this.feedbackDb[i] = item
        });
    }
    //this.feedbackButtonPressed = true;
    this.pageIsLoaded = true; //set to true if page is loaded
  }

  getFeedbackDataById(id:string){
    this.feedbackRefById = this.afs.doc(`${localStorage.getItem('boatForRatingBrand') + localStorage.getItem('boatForRatingName')}/${id}`);
    this.feedbackRefById.valueChanges().subscribe(item => {
      this.feedbackByid = item;
      localStorage.setItem('FeedbackByIdData', JSON.stringify(item));
      
    })

    setTimeout(() => {this.confirmEditFeedbackDialog();}, 5)

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

  updateBoatStats(){
    this.ratingBoat.push(this.currentRate);
    this.updateRatingArray(this.ratingBoat);

    var sum = this.ratingBoat.reduce((acc, cur) => acc + cur, 0);
    console.log("Sum: " + sum);

    var div = sum/ (this.ratingBoat.length - 1);
    console.log("Div " + div);


    this.updateRatingSum(div)
  }

  goToDashboard(){
    this.router.navigateByUrl("/dashboard");
  }

  editFeedback(ratingId:string){
    this.getFeedbackDataById(ratingId);
  }

  deleteFeedback(ratingId:string){
    console.log('Ratingid to delete: ', ratingId);
  }
}
