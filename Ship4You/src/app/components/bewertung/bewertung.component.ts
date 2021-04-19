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

  /**
   * Variable to save the current rate of the feedback
   */
  protected currentRate = 6;

  /**
   * Variable to save the current date of the feedback
   */
  mydate:string="";

  /**
   * Array variable to save all boats
   */
  private boats: any = [];

  /**
   * Variable to save a single boat
   */
  boat: any = new BoatDTO;

  /**
   * Variable for the id of the singleBoat
   */
  id:string = localStorage.getItem('boatForRating');
  
  /**
   * Variable to save the feedback text
   */
  feedback:string="";

  /**
   * Toogle state if user is hovering about something
   */
  isHovering: boolean;

  /**
   * Save the Id of the rating
   */
  ratingId:string="";

  /**
   * All feedbacks in db
   */
  feedbackDb:any[] = [];

  /**
   * Save the new rating
   */
  feedbackByid:any = new Rating;
  
  /**
   * Save all feedback datas from db
   */
  feedbackRef: AngularFirestoreDocument<any>[] = [];

  /**
   * Save feedback by Id
   */
  feedbackRefById: AngularFirestoreDocument<any>;

  /**
   * Save all rating numbers [6,7,4,3,..]
   */
  ratingBoat: number[];

  /**
   * Save the state if data was loaded or not
   */
  dataLoaded: boolean = false;

  /**
   * Save the key of the boat
   */
  boatKey: string="";

  /**
   * Show the task data for uploading pictures
   */
  task: AngularFireUploadTask;

  /**
   * Save the percentage for uploading pictures
   */
  percentage: Observable<number>;

  /**
   * Save the snapshot changes for uploading pictures
   */
  snapshot: Observable<any>;

  /**
   * Save the downloadUrl for uploading pictures
   */
  downloadURL: string;
  
  /**
   * Save the current default elevation
   */
  defaultElevation = 2;


  /** 
   * Save all feedbacks in array to split them on different sides
  */
  feedbackArray=[];

  /**
   * Number of the current page
   */
  currentPage = 1;

  /**
   * Save the avaiable numbers of page sizes
   */
  pageSizes = [4,10,50,100];

  /**
   * Set the current pageSize
   */
  feedbackArraySize = this.pageSizes[0];

  /**
   * Save the state if page is loaded or not
   */
  pageIsLoaded: boolean = false; //boolean if page is loaded
  
  /**
   * Save the state if there is a next page
   */
  nextPage: boolean = false; //is there a next Page

  /**
   * Save the state if there is a behind page
   */
  behindPage: boolean = false; //is there a Page behind

  /**
   * Save the url of the picture
   */
  url:string = "";

  /**
   * Save the displayname
   */
  displayName:string ="";

  /**
   * Save the state if there is no result
   */
  showNoResult:boolean=true;

  /**
   * 
   * @param dialog 
   * @param boatService 
   * @param fs 
   * @param storage 
   * @param authService 
   * @param datePipe 
   * @param afs 
   * @param router 
   */
  constructor(public dialog: MatDialog,private boatService: BoatService, public fs: FirebaseService, private storage: AngularFireStorage, public authService: AuthService, private datePipe:DatePipe, public afs: AngularFirestore, private router: Router ) {
    
    /**
     * Set the date time
     */
    this.mydate = this.datePipe.transform(Date.now(), 'dd.MM.yyyy');
  }

  /**
   * Push all feedbacks for a side
   */
  feedbackFunct(){
    this.feedbackArray = [];
    for (let i = 0; i < this.feedbackArraySize; i++){
      this.feedbackArray.push(i);
    }
  }

  /**
   * Methode will be called if the user confirm the create feedback dialog
   */
  confirmDialog(): void {
    const dialogRef = this.dialog.open(CreateFeedbackComponent, {
      maxWidth: "400px"
    });
    /**
     * This section will be called after closing the dialog
     */
    dialogRef.afterClosed().subscribe(dialogResult => {
      
      /**
       * Check if there are no results
       */
      if(!dialogResult){

        /**
         * Call the getFeedbackData() methode
         */
        this.getFeedbackData();
      }
      this.showNoResult = false;
    });
  }

  /**
   * Methode will be called if the user confirm the edit feedback dialog
   */
  confirmEditFeedbackDialog(): void {
    const dialogRef = this.dialog.open(EditFeedbackComponent, {
      maxWidth: "400px"
    });

    /**
     * This section will be called after closing the dialog
     */
    dialogRef.afterClosed().subscribe(dialogResult => {
      
      /**
       * Check if there are no results
       */
      if(!dialogResult){

        /**
         * Call the getFeedbackData() methode
         */
       this.getFeedbackData();
      }
      this.showNoResult = false;
    });
  }

  /**
   * Methode to switch the pages
   * 
   * @param pageNum -> to wich page will you go
   */
  changePage(pageNum){
    
    /**
     * Check if the page is aviable
     */
    if(pageNum>=1 && (this.feedbackDb.length-1)/this.feedbackArraySize) {
      
      /**
       * Set the currentPage 
      */
      this.currentPage = pageNum;

      /**
       * Check if pageNum is 1
       */
      if (pageNum == 1){

        /**
          * Set the behindPage to true
          */
        this.behindPage = true;
      }

      /**
       * Check if nextPage is true
       */
      if (this.nextPage == true){

        /**
         * Set nextPage to false
         */
        this.nextPage = false;
      }
    }
  }

  /**
   * Methode which returns the max page
   */
  getMaxPage(){
    return Math.ceil((this.feedbackDb.length-1)/this.feedbackArraySize);
  }

  /**
   * Methode to go to last aviable page
   */
  changeToLastPage(){

    /**
     * Set the current page
     * 
     * Calls the getMaxPage() methode
     */
    this.currentPage =  this.getMaxPage()//Get Max
    
    /**
     * Set nextPage to true
     */
    this.nextPage = true;

    /**
     * Check if there is a behindPage
     */
    if (this.behindPage == true){
      /**
       * Set behindPage to false
       */
      this.behindPage = false;
    }
  }

  /**
   * 
   * @param minus -> how much pages minus
   */
  minusPage(minus) {
    /**
     * Check if page is aviable
     */
    if(this.currentPage-minus>=1 && this.currentPage-minus<=(this.feedbackDb.length-1)/this.feedbackArraySize) {
      
      /**
       * Set current aviable page
       */
      this.currentPage = this.currentPage-minus

      /**
       * Check if page is 1
       */
      if (this.currentPage == 1){ //currentPage = 1
        
        /**
         * Set behind page to true
         */
        this.behindPage = true;
      }

      /**
       * Check if nextPage is true
       */
      if (this.nextPage == true){

        /**
         * Set nextPage to false
         */
        this.nextPage = false;
      }
    }
  }

  /**
   * 
   * @param plus -> how much pages plus
   */
  plusPage(plus) {

    /**
     * Check if page is aviable
     */
    if(this.currentPage+plus>=1 && this.currentPage+plus<=Math.ceil((this.feedbackDb.length)/this.feedbackArraySize)) {
      
      /**
       * Set current page
       */
      this.currentPage = this.currentPage+plus;

      /**
       * Check if currentPage is the max page
       */
      if (this.currentPage == this.getMaxPage()){
        /**
         * Set nextPage to true
         */
        this.nextPage = true;
      }

      /**
       * Check if behind page is true
       */
      if (this.behindPage == true){

        /**
         * Set behind page to false
         */
        this.behindPage = false;
      }
    }
  }

  /**
   * 
   * @param event -> is there an event true or false
   */
  toggleHover(event: boolean) {

    /**
     * Set hovering to the event state
     */
    this.isHovering = event;
  }


  /**
   * Will be called at first
   */
  ngOnInit() {
    /**
     * Get the current feedback
     */
    this.afs.collection(localStorage.getItem('boatForRatingBrand')+localStorage.getItem('boatForRatingName')).valueChanges().subscribe(v => this.ratingId = `${v.length}`);
    
    /**
     * Set feedbackBoatId to localstorage
     */
    localStorage.setItem("feedbackBoatId", localStorage.getItem('boatForRatingBrand')+localStorage.getItem('boatForRatingName'));
    
    /**
     * Get all boats
     */
    this.getBoatsList();
    
    /**
     * Get the currentUser
     */
    const feedbackRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${localStorage.getItem('userUid')}`);

    /**
     * Set picture url
     */
    feedbackRef.valueChanges().subscribe(x => this.url = x.photoURL);
    
    /**
     * Set the displayName
     */
    feedbackRef.valueChanges().subscribe(x => this.displayName = x.displayName);

    /**
     * Calls feedback function
     */
    this.feedbackFunct();

    /**
     * Set the behindpage to true
     */
    this.behindPage = true;

    /**
     * Calls the confirm dialog methode
     */
    this.confirmDialog();
  }

  /**
   * Save all pictures
   */
  files: File[] = [];

  /**
   * 
   * @param files -> the current pictures
   */
  onDrop(files: FileList) {

    /**
     * Go through the current pictures
     */
    for (let i = 0; i < files.length; i++) {
      
      /**
       * Push it to array
       */
      this.files.push(files.item(i));

      /**
       * Calls other mmethode
       */
      this.startUpload(files.item(i))
    }
  }

  /**
   * 
   * @param file get the current file
   */
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

        /**
         * Set download url
         */
        this.downloadURL = await ref.getDownloadURL().toPromise();

        /**
         * Set downloadUrl to collection
         */
        this.afs.collection('files').add( { downloadURL: this.downloadURL, path });
      }),
    );
  }

  /**
   * 
   * @param snapshot -> the current snapshot
   * @returns the state
   */
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

  /**
   * Get all boats
   */
  getBoatsList() {
    this.boatService.getBoatsList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(boats => {
      this.boats = boats;
      /**
       * Calls the singleBoat
       */
      this.getSingleBoat();
    });

    /**
     * Set all data loaded to true
     */
    this.dataLoaded = true;
  }

  /**
   * 
   * @returns a single boat or null
   */
  getSingleBoat(): any{         

    /**
     * Get the whole number of boats
     */
    var c = localStorage.getItem('numberOfBoats');
    
    /**
     * Check if there are more then null boats
     */
    if(!isNaN(Number(c))){
      /**
       * Set the counter variable
       */
      var counter = Number(c);

      /**
       * Go through the boats
       */
      for(let i = 0; i < counter;i++){

        /**
         * Check if id is the same
         */
        if(this.id == this.boats[i].key){
          
          /**
           * Set the boat dto to the single boat
           */
          this.boat = this.boats[i];
          
          /**
           * Set all reatings
           */
          this.ratingBoat = this.boat.allReatings;
          
          /**
           * Set the key
           */
          this.boatKey = this.boat.key;
        }
      }
      return this.boat;
    }
    else{
      console.log("Not a number!");
      return null;
    }
  }


  /**
   * Methode which save the feedbacks of the boat to array
   */
  getFeedbackData() {
    /**
     * Go trough array
     */
    for(let i =0; i < parseInt(this.ratingId); i++){
      /**
       * Get current feedback
       */
      this.feedbackRef[i] = this.afs.doc(`${localStorage.getItem('boatForRatingBrand') + localStorage.getItem('boatForRatingName')}/${i}`);
      this.feedbackRef[i].valueChanges().subscribe(item =>
      {
        /**
         * Set feedback
         */
        this.feedbackDb[i] = item
      });
    }
    /**
     * Set to true if page is loaded
     */
    this.pageIsLoaded = true;
  }

  /**
   * For edit
   * @param id -> id of the feedback
   */
  getFeedbackDataById(id:string){

    /**
     * Get the current feedback
     */
    this.feedbackRefById = this.afs.doc(`${localStorage.getItem('boatForRatingBrand') + localStorage.getItem('boatForRatingName')}/${id}`);
    this.feedbackRefById.valueChanges().subscribe(item => {
      
      /**
       * Save the current feedback
       */
      this.feedbackByid = item;
      
      /**
       * Save the current feedback to localstorage
       */
      localStorage.setItem('FeedbackByIdData', JSON.stringify(item));
    })

    /**
     * Make a timeout to get the feedback data
     * Calls edit dialog
     */
    setTimeout(() => {this.confirmEditFeedbackDialog();}, 5)
  }

  /**
   * Updates the rating of the boat
   * 
   * @param ratingBoat -> current rating
   */
  updateRatingArray(ratingBoat: any) {
    this.boatService
      .updateBoat(this.boatKey, { allReatings: ratingBoat })
      .catch(err => console.log(err));
  }

  /**
   * Update the rating sum
   * 
   * @param ratingDiv div of the ratings
   */
  updateRatingSum(ratingDiv: any)
  {
    this.boatService
    .updateBoat(this.boatKey, { rating: ratingDiv })
    .catch(err => console.log(err));
  }

  /**
   * Update the Boat stats
   */
  updateBoatStats(){
    /**
     * Save the current rate to array
     */
    this.ratingBoat.push(this.currentRate);

    /**
     * Calls updateRating methode
     */
    this.updateRatingArray(this.ratingBoat);

    /**
     * Sum of all reatings
     */
    var sum = this.ratingBoat.reduce((acc, cur) => acc + cur, 0);

    /**
     * Div of all reatings
     */
    var div = sum/ (this.ratingBoat.length - 1);

    /**
     * Calls updateRatingSum() methode
     */
    this.updateRatingSum(div)
  }

  /**
   * Methode to get back to dashboard
   */
  goToDashboard(){
    this.router.navigateByUrl("/dashboard");
  }

  /**
   * 
   * @param ratingId -> get the Feedback id for edit
   */
  editFeedback(ratingId:string){
    /**
     * Calls the getFeedbackDataById() methode
     */
    this.getFeedbackDataById(ratingId);
  }
}
