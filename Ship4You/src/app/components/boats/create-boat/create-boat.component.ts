import { Component, NgZone, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { finalize, map } from 'rxjs/operators';
import { BoatDTO } from '../boat';
import { BoatService } from '../boat.service';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { FirebaseService } from 'src/app/shared/services/firebase.service';

//Interface for selecting boat types (Sailingboat, motorboat, ...)
interface Types {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-create-boat',
  templateUrl: './create-boat.component.html',
  styleUrls: ['./create-boat.component.scss']
})
export class CreateBoatComponent implements OnInit {

  //Saving new boat states
  boat: BoatDTO = new BoatDTO();

  //Save button if every property is filled
  submitted = false;

  //Save all boats from db
  boats: BoatDTO[] = [];

  //Save all boat ids (Brand+Name)
  ID : string[] = [];

  //Id counter for all ids
  IDCounter : number = 0;

  //Checks if id already exists
  boolCheck : boolean = false;

  //Upload file
  selectedFile: FileList | null;

  //The image upload speed in percent
  uploadPercent: Observable<number>;

  //The document upload speed in percent
  uploadPercentDocument: Observable<number>;

  //The image download url
  downloadURLObservable: Observable<string>;

  //The document download url
  downloadURLObservableDocument: Observable<string>;

  //Includes documents from db
  tests: Observable<any[]>;

  //The description of the second uploaded picture
  description: string;

  /**
   * 
   * @param boatService 
   * @param router 
   * @param authService 
   * @param ngZone 
   * @param storage 
   * @param fs 
   * @param afs 
   */
  constructor(private boatService: BoatService, private router: Router, public authService: AuthService, public ngZone: NgZone, private storage: AngularFireStorage, private fs: FirebaseService, private afs: AngularFirestore) { }

  /**
   * Will be called at first
   */
  ngOnInit() {

    /**
     * Call getBoat() methode
     */
    this.getBoat();

    /**
     * Call showPicture() methode
     */
    this.showPictures();

    /**
     * Call showDocuments() methode
     */
    this.showDocuments();
  }

  /**
   * Variable for hovering state
   */
  isHovering: boolean;

  /**
   * Small animation for choosing an image
   * 
   * @param event -> true or false
   */
  toggleHover(event: boolean) {
    /**
     * Set hovering state
     */
    this.isHovering = event;
  }

  //Saving all documents
  filesDocuments: File[] = [];

  //Saving all images
  filesPictures: File[] = [];

  //Saving boat types
  types: Types[] = [
    {value: 'Sailingboat', viewValue: 'Sailingboat'},
    {value: 'Motorboat', viewValue: 'Motorboat'}
  ]

  //Get all boats from db
  getBoat(){
    this.boatService.getBoatsList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(boats => {

      /**
       * Set boats array to boats
       */
      this.boats = boats;
    });
  }

  //Checks if a boat id already exists (For example (Brand+Name): MaxusStern)
  checkID() : number{
    /**
     * set counter to 0
     */
    this.IDCounter = 0;

    /**
     * go through all boats
     */
    for(let i = 0; i < this.boats.length; i++)
    {
      /**
       * Set id
       */
      this.ID[this.IDCounter] = this.boats[i].brand+this.boats[i].name;
      
      /**
       * Make it one higher
       */
      this.IDCounter++;
    }

    /**
     * Go through all Ids
     */
    for(var i = 0; i< this.IDCounter; i++){
      if(this.ID[i] === this.boat.brand+this.boat.name){
        
        /**
         * Set boolCheck to false
         */
        this.boolCheck = false;
        return 0;
      }
      /**
       * Check if brand and name are null
       */
      else if(this.boat.brand == "" ||  this.boat.name == ""){
        
        /**
         * Set boolCheck to false
         */
        this.boolCheck = false;
        return 1;
      }
      else
        /**
         * Set boolCheck to true
         */
        this.boolCheck = true;
    }
    /**
     * Check if some data are null
     */
    if(this.boat.brand == null ||  this.boat.name == null || this.boat.cabins == null ||this.boat.length == null || this.boat.lessor == null
      || this.boat.location == null || this.boat.masts == null || this.boat.numberOfPeople == null || this.boat.vintage == null || this.boat.sail == null || this.boat.port == null || this.boat.linkToRentSide == null || this.boat.creatorEmail == null){
        this.boolCheck = false;
        return 2;
    }

    /**
     * Check if bool are true
     */
    if(this.boolCheck)
      return -1;
    else
      this.IDCounter = 0;
  }

  //Save boat details and navigate to multiple upload site
  goToMultUpload(){

    /**
     * Check if description are not null
     */
    if (this.description != null){
      /**
       * Set description to localeStorage
       */
      localStorage.setItem("titlePictureDescription", this.description);
    }
    /**
     * Set boat
     */
    this.boatService.tmpBoat = this.boat;

    /**
     * Set boat to localStorage
     */
    localStorage.setItem('tmpBoat', JSON.stringify(this.boat));

    /**
     * Save boatid to localstorage
     */
    localStorage.setItem('createBoatId', this.boat.brand+this.boat.name);
    
    /**
     * Navigate to mult-upload
     */
    this.router.navigateByUrl("multiple-upload");
  }

  //navigate to dashboard
  goToDashboard(){
    this.router.navigateByUrl("/dashboard");
  }

  //Upload title image of a boat
  detectFiles(event) {
    /**
     * Set selectedFile
     */
    this.selectedFile = event.target.files[0];

    /**
     * Check if there is a file selected
     */
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        /**
         * Set url
         */
        this.url = (event.target as FileReader).result; 
      }
    }

    this.uploadFile();
  }

  //Document name
  fileName: string;

  //Document ending name (.pdf, .docx, ...)
  fileEnd: string;

  //Upload a document
  detectFilesDocuments(event) {
    /**
     * Set selectedFile
     */
    this.selectedFile = event.target.files[0];
    /**
     * Set filename
     */
    this.fileName = event.target.files[0].name;
    /**
     * Extract name
     */
    var ext = this.fileName.substring(this.fileName.lastIndexOf('.') + 1);
    
    /**
      * Check if it is a txt or pdf or xlsx file
      */
    if (ext.toLowerCase() == 'txt' || ext.toLowerCase() == 'pdf' || ext.toLowerCase() == 'xlsx') {
      this.fileEnd = ext.toLowerCase();
    }
    /**
      * Calls uploadFileDocuments() methode
      */
    this.uploadFileDocuments();
  }

  //All uploaded documents
  uploadUrlArrayDocuments: Observable<String>[] = [];

  //Upload document to db
  uploadFileDocuments() {
    /**
     * Get the doc ref
     */
    const myTest = this.afs.collection("documentUpload").ref.doc();

    /**
     * Set selected file
     */
    const file = this.selectedFile
    /**
     * Set file Path
     */
    const filePath = `${myTest.id}/name1`;

    /**
     * Set fileRef
     */
    const fileRef = this.storage.ref(filePath);

    /**
     * Set task of file
     */
    const task = this.storage.upload(filePath, file);

    /**
     * Set current percent
     */
    this.uploadPercentDocument = task.percentageChanges();

    /**
     * Upload document
     */
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().toPromise().then( (url) => {
          /**
           * Set download url
           */
          this.downloadURLObservableDocument = url;

          /**
           * push document url to array
           */
          this.uploadUrlArrayDocuments.push(this.downloadURLObservable);
          /**
           * Set localStorage
           */
          localStorage.setItem("downloadDocumentUrl", url);

          /**
           * Set doc
           */
          myTest.set({
            documents : this.downloadURLObservable,
            myId : myTest.id
          })
        }).catch(err=> { console.log(err) });
      })
    )
    .subscribe()
  }

  //Get all boat documents from db
  showDocuments() {
    this.tests = this.fs.getDocumentsCreate();
  }

  //All uploaded images
  uploadUrlArray: Observable<String>[] = [];

  //URL of the current picture
  url;
  uploadFile() {

    /**
     * Get the doc data
     */
    const myTest = this.afs.collection("test76").ref.doc();

    /**
     * Set file
     */
    const file = this.selectedFile

    /**
     * Set file path
     */
    const filePath = `${myTest.id}/name1`;

    /**
     * Set fileRef
     */
    const fileRef = this.storage.ref(filePath);

    /**
     * Set task
     */
    const task = this.storage.upload(filePath, file);

    /**
     * Set percent
     */
    this.uploadPercent = task.percentageChanges();

    /**
     * Uploade picture
     */
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().toPromise().then( (url) => {

          /**
           * Set download url
           */
          this.downloadURLObservable = url;
          /**
           * Add downloadurl to array
           */
          this.uploadUrlArray.push(this.downloadURLObservable);
          /**
           * Set localstorage
           */
          localStorage.setItem("downloadUrl", url);

          myTest.set({
            imagenes : this.downloadURLObservable,
            myId : myTest.id
          })
        }).catch(err=> { console.log(err) });
      })
    )
    .subscribe()
  }
  
  //Get all boat pictures from db
  showPictures() {
    this.tests = this.fs.getTestCreate();
  }
}
