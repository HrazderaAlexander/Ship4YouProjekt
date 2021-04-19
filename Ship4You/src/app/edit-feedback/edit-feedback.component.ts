import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, tap, map } from 'rxjs/operators';
import { Rating } from '../components/bewertung/rating';
import { BoatDTO } from '../components/boats/boat';
import { BoatService } from '../components/boats/boat.service';
import { CreateFeedbackComponent } from '../create-feedback/create-feedback.component';
import { FirebaseService } from '../shared/services/firebase.service';

@Component({
  selector: 'app-edit-feedback',
  templateUrl: './edit-feedback.component.html',
  styleUrls: ['./edit-feedback.component.scss']
})
export class EditFeedbackComponent implements OnInit {

  //Saving the current rating to edit
  rating:Rating = null;

  //Saving the current boat states
  boat: any = new BoatDTO;

  //Small animation to upload images
  isHovering: boolean;
  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  //The current rating id
  ratingId:string="";

  //The date of the current rating
  mydate:string="";

  //Saving all boats from db
  boats: any = [];

  //Saving the key from the current boat
  boatKey: string="";

  //Saving the id from the current boat
  id:string = localStorage.getItem('boatForRating');

  //Saving all counted stars from the rating boat
  ratingBoat: number[];

  //Checks if all data is loaded
  dataLoaded: boolean = false;

  //Feedback text of the current rating
  feedback:string="";

  //Number of the current rating stars
  currentRate = 2;

  //User image url of the current rating
  url:string = "";

  //username of the current rating
  displayName:string ="";

  //Upload progress of an image in percent
  uploadPercent: Observable<number>;

  //download url of the current image
  downloadURLObservable: Observable<string>;

  //Selected file to upload
  selectedFile: FileList | null;

  //All uploaded images from the db
  tests: Observable<any[]>;

  //
  constructor(private boatService: BoatService, private fs: FirebaseService, public dialogRef: MatDialogRef<CreateFeedbackComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private router: Router, public afs: AngularFirestore, private datePipe:DatePipe,private storage: AngularFireStorage) {
    //Sets the current date to a specific format
    this.mydate = this.datePipe.transform(Date.now(), 'dd.MM.yyyy');
  }

  //close the popup window
  onDismiss(): void {
    this.dialogRef.close(false);
  }

  ngOnInit() {
    //Gets the actual feedback data
    this.rating = JSON.parse(localStorage.getItem('FeedbackByIdData'));

    //Gets all uploaded images of the current rating
    this.uploadUrlArray = this.rating.picturesId;
  }

  //Upload the choosen file
  detectFiles(event) {
    //save the selected file
    this.selectedFile = event.target.files[0];

    //calls the method to upload the selected file
    this.uploadFile();
  }

  //Save the url from all uploaded files
  uploadUrlArray: Observable<String>[] = [];

  //Upload the current image to db
  uploadFile() {
    //connect to firestore doc
    const myTest = this.afs.collection(localStorage.getItem("feedbackBoatId")+"MultFeedback" + this.displayName).ref.doc();
    //the selected file
    const file = this.selectedFile
    //file path in db
    const filePath = `${myTest.id}/name1`;
    //the file reference in firestorage
    const fileRef = this.storage.ref(filePath);
    //task to start the upload to firestorage
    const task = this.storage.upload(filePath, file);

    //Actual upload progress in percent
    this.uploadPercent = task.percentageChanges();

    //start the task to upload the image to db
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().toPromise().then( (url) => {
          //Save the download url
          this.downloadURLObservable = url;
          //push the actual download url to the array of all image urls
          this.uploadUrlArray.push(this.downloadURLObservable);

          //Save it to the database
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

  //Show all upload images from the current rating
  showImagenes() {
    this.tests = this.fs.getTestFeedback(this.displayName);
  }

  //Get the actual boat to rate
  getSingleBoat(): any{
    //Actual number of all boats
    var c = localStorage.getItem('numberOfBoats');
    if(!isNaN(Number(c))){
      var counter = Number(c);
      for(let i = 0; i < counter;i++){
        //Get all boat states with the actual key
        if(this.id == this.boats[i].key){

          /**
           * Set boat
           */
          this.boat = this.boats[i];

          /**
           * Set rating Boat
           */
          this.ratingBoat = this.boat.allReatings;

          /**
           * Set key
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
     * Call getBoatsList() methode
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
       * Call methode
       */
      this.getSingleBoat();
    });

    this.dataLoaded = true;
  }

  //Set the feedback data to update in db
  SetFeedbackData() {
    //connection to the document reference in Angular firestorage
    const feedbackRef: AngularFirestoreDocument<any> = this.afs.doc(`${localStorage.getItem('boatForRatingBrand') + localStorage.getItem('boatForRatingName')}/${this.rating.idRating}`);

    //Sets the feedback data to update the feedback in db
    const feedbackData: Rating = {
      idRating: this.rating.idRating,
      username: this.rating.username,
      date: this.mydate,
      ratingStars: this.rating.ratingStars,
      text: this.rating.text,
      picturesId: this.uploadUrlArray,
      userImage: this.rating.userImage,
      userId: this.rating.userId
    }
    this.uploadUrlArray = [];
    return feedbackRef.update(feedbackData)
  }

  //Update the boat rating states
  updateBoatStats(){
    //adds the currentRate to the rating array
    this.ratingBoat.push(this.currentRate);
    //updates the rating array
    this.updateRatingArray(this.ratingBoat);
    //calculate the sum of all ratings
    var sum = this.ratingBoat.reduce((acc, cur) => acc + cur, 0);
    var div = sum/ (this.ratingBoat.length - 1);
    //updates the sum of all ratings in db
    this.updateRatingSum(div)
  }

  //Updates the rating array in db
  updateRatingArray(ratingBoat: any) {

    /**
     * Call methode
     */
    this.boatService
      .updateBoat(this.boatKey, { allReatings: ratingBoat })
      .catch(err => console.log(err));
  }

  //Updates the rating sum (sum of rating stars)
  updateRatingSum(ratingDiv: any)
  {
    /**
     * Call methode
     */
    this.boatService
    .updateBoat(this.boatKey, { rating: ratingDiv })
    .catch(err => console.log(err));
  }

  //Update current feedback in db and navigate to bewertungen
  editFeedback(){
    /**
     * Close dialog
     */
    this.dialogRef.close(false);

    /**
     * Call methode()
     */
    this.SetFeedbackData();

    /**
     * Navigate to other page
     */
    this.router.navigateByUrl('/bewertung')
  }

  //Deletes a picture of your choice from the rating
  deleteImage(image:Observable<string>){
    /**
     * Go through images
     */
    this.uploadUrlArray.forEach(img => {
      /**
       * Check if images are equal
       */
      if(img == image){
        /**
         * Delete Image
         */
        this.uploadUrlArray.splice(this.uploadUrlArray.indexOf(image),1);
      }
    })
  }
}
