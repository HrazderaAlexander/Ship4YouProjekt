import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
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

  //Boat which you want to rate
  boat: any = new BoatDTO;

  //Small animation for uploading a picture
  isHovering: boolean;

  //The id for a rating
  ratingId:string="";

  //The date when the feedback was written
  mydate:string="";

  //All boats from db
  boats: any = [];

  //The download url from the uploaded image
  downloadURL: string;

  //The key from the boat (Firebase Realtime database boat id)
  boatKey: string="";

  //Boat id (Brand+Name)
  id:string = localStorage.getItem('boatForRating');

  //Array of the current rates (counted stars)
  ratingBoat: number[];

  //Checks if the whole data is already loaded for the page
  dataLoaded: boolean = false;

  //Saving the feedback text
  feedback:string="";

  //Saving the current star rating
  currentRate = 2;

  //The url of the current user profil picture
  url:string = "";

  //The username of the current user
  displayName:string ="";

  //The upload process of an image in percent
  uploadPercent: Observable<number>;

  //The download url of the current uploaded image
  downloadURLObservable: Observable<string>;

  //Selected file to upload
  selectedFile: FileList | null;

  //Saving all uploaded images to that rating
  tests: Observable<any[]>;

  //The current boat to rate
  currentRatingBoat: BoatDTO = new BoatDTO();

  /**
   * 
   * @param boatService 
   * @param fs 
   * @param dialogRef 
   * @param data 
   * @param router 
   * @param afs 
   * @param datePipe 
   * @param storage 
   */
  constructor(private boatService: BoatService, private fs: FirebaseService, public dialogRef: MatDialogRef<CreateFeedbackComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private router: Router, public afs: AngularFirestore, private datePipe:DatePipe,private storage: AngularFireStorage) {
    
    /**
     * Set current date
     */
    this.mydate = this.datePipe.transform(Date.now(), 'dd.MM.yyyy');
  }

  //To close the popup window (clicking cancel)
  onDismiss(): void {
    /**
     * Close dialog
     */
    this.dialogRef.close(false);
  }

  /**
   * Will be called at first
   */
  ngOnInit() {
    /**
     * Get doc ref
     */
    const feedbackRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${localStorage.getItem('userUid')}`);

    /**
     * Set url
     */
    feedbackRef.valueChanges().subscribe(x => this.url = x.photoURL);

    /**
     * Set displayName
     */
    feedbackRef.valueChanges().subscribe(x => this.displayName = x.displayName);

    this.afs.collection(localStorage.getItem('boatForRatingBrand')+localStorage.getItem('boatForRatingName')).valueChanges().subscribe(v => this.ratingId = `${v.length}`);
    
    /**
     * Set boat id to localStorage
     */
    localStorage.setItem("feedbackBoatId", localStorage.getItem('boatForRatingBrand')+localStorage.getItem('boatForRatingName'));
    
    /**
     * Call boatList
     */
    this.getBoatsList();

    /**
     * Set boat
     */
    this.currentRatingBoat = this.boatService.tmpBoat;
    
    /**
     * Call showImagenes() methode
     */
    this.showImagenes();
  }

  //Upload the selected file
  detectFiles(event) {

    /**
     * Set selected File
     */
    this.selectedFile = event.target.files[0];
    
    /**
     * Call uploadFile() methode
     */
    this.uploadFile();
  }

  //Saving the url of all uploaded images
  uploadUrlArray: Observable<String>[] = [];

  //Upload Image to db
  uploadFile() {

    /**
     * Get ref doc of feedbackboat
     */
    const myTest = this.afs.collection(localStorage.getItem("feedbackBoatId")+"MultFeedback" + this.displayName).ref.doc();
    
    /**
     * Set file
     */
    const file = this.selectedFile

    /**
     * Set filePath
     */
    const filePath = `${myTest.id}/name1`;

    /**
     * Set fileRef
     */
    const fileRef = this.storage.ref(filePath);

    /**
     * Set upload task
     */
    const task = this.storage.upload(filePath, file);

    /**
     * Set percent from upload
     */
    this.uploadPercent = task.percentageChanges();

    /**
     * Save file
     */
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().toPromise().then( (url) => {

          /**
           * Set downloadUrl
           */
          this.downloadURLObservable = url;

          /**
           * Push download url to array
           */
          this.uploadUrlArray.push(this.downloadURLObservable);

          /**
           * Set data
           */
          myTest.set({
            imagenes : this.downloadURLObservable,
            myId : myTest.id
          })
        }).catch(err=> { console.log(err) });
      })
    )
    .subscribe()
  }

  //Show all images from db
  showImagenes() {

    /**
     * Call getTestFeedback()
     */
    this.tests = this.fs.getTestFeedback(this.displayName);
  }

  /**
   * 
   * @param event -> true or false
   */
  toggleHover(event: boolean) {

    /**
     * Set hovering to true or false
     */
    this.isHovering = event;
  }

  //Get the actual boat states
  getSingleBoat(): any{
    /**
     * Set counter from localstorage
     */
    var c = localStorage.getItem('numberOfBoats');

    /**
     * Check if counter is not null
     */
    if(!isNaN(Number(c))){

      /**
       * set counter
       */
      var counter = Number(c);

      /**
       * Go through all boats
       */
      for(let i = 0; i < counter;i++){

        /**
         * Check if Ids are equal
         */
        if(this.id == this.boats[i].key){

          /**
           * Set boat
           */
          this.boat = this.boats[i];

          /**
           * Set ratingBoat
           */
          this.ratingBoat = this.boat.allReatings;

          /**
           * Set boat-key
           */
          this.boatKey = this.boat.key;
        }
      }
      return this.boat;
    }
    else{
      return null;
    }
  }

  //Get all boats from db
  getBoatsList() {
    /**
     * Call getBoatsList()
     */
    this.boatService.getBoatsList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(boats => {
      /**
       * Set boats
       */
      this.boats = boats;

      /**
       * Calls getSingleBoat() methode
       */
      this.getSingleBoat();
    });

    /**
     * Set loaded data to true
     */
    this.dataLoaded = true;
  }

  //Set feedback data to create a new rating in db
  SetFeedbackData() {

    /**
     * Get feedback Ref
     */
    const feedbackRef: AngularFirestoreDocument<any> = this.afs.doc(`${localStorage.getItem('boatForRatingBrand') + localStorage.getItem('boatForRatingName')}/${this.ratingId}`);

    /**
     * Set feedBack data
     */
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
    /**
     * Clear uploadUrlArray 
     */
    this.uploadUrlArray = [];
    /**
     * Merge data
     */
    return feedbackRef.set(feedbackData, {
      merge: true
    })
  }

  //Updates the current boat rating states
  updateBoatStats(){
    /**
     * Add current rate to array
     */
    this.ratingBoat.push(this.currentRate);

    /**
     * Call updateRatingArray()
     */
    this.updateRatingArray(this.ratingBoat);

    /**
     * Set sum
     */
    var sum = this.ratingBoat.reduce((acc, cur) => acc + cur, 0);

    /**
     * Set div
     */
    var div = sum/ (this.ratingBoat.length - 1);

    /**
     * Call methode
     */
    this.updateRatingSum(div)
  }

  //Updates the rating array in db
  updateRatingArray(ratingBoat: any) {

    /**
     * Call updateBoat() methode
     */
    this.boatService
      .updateBoat(this.boatKey, { allReatings: ratingBoat })
      .catch(err => console.log(err));
  }

  //Updates the rating sum (sum of rating stars)
  updateRatingSum(ratingDiv: any)
  {
    /**
     * Call updateBoat() methode
     */
    this.boatService
    .updateBoat(this.boatKey, { rating: ratingDiv })
    .catch(err => console.log(err));
  }

  //Adds the feedback to db and navigates to bewertung
  addFeedback(){
    /**
     * Close dialog
     */
    this.dialogRef.close(false);

    /**
     * Call methode
     */
    this.updateBoatStats();

    /**
     * Call SetFeedbackData() methode
     */
    this.SetFeedbackData();

    /**
     * Navigate to other page
     */
    this.router.navigateByUrl('/bewertung')
  }

}
