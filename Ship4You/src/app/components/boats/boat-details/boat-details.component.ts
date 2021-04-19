import { Component, OnInit, Input, OnDestroy, Inject } from '@angular/core';
import { BoatService } from '../boat.service';
import { BoatDTO } from '../boat';
import { NavigationEnd, Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { DOCUMENT } from '@angular/common';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { SignInComponent } from '../../sign-in/sign-in.component';
import { map } from 'rxjs/internal/operators/map';
import * as $ from 'jquery';
import { Rating } from '../../bewertung/rating';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { EditBoatComponent } from 'src/app/edit-boat/edit-boat.component';

@Component({
  selector: 'app-boat-details',
  templateUrl: './boat-details.component.html',
  styleUrls: ['./boat-details.component.css']
})
export class BoatDetailsComponent implements OnInit {

  /**
   * Save the user id
   */
  userId:string = "";

  /**
   * Save the button if it is edited or not
   */
  isEdit:boolean = false;

  /**
   * Save the current boat
   */
  @Input() boat: BoatDTO;

  /**
   * Save the current button state
   */
  @Input() showButtons:string;

  /**
   * Save the state of the favourite button
   */
  favButtonPressed:boolean;

  /**
   * Save the favourite boats
   */
  favRef: AngularFirestoreDocument<any>;
  
  /**
   * Save the current rate
   */
  currentRate = 0;
  
  /**
   * Save the userIds
   */
  userIds : string[] = JSON.parse(localStorage.getItem('userIds'));
  
  /**
   * Save the length of the feedback
   */
  feedbackLength = 0;

  /**
   * Path of the boats
   */
  dbPath = '/customers';

  /**
   * Save all boats from db
   */
  boatsRef: AngularFireList<BoatDTO> = null;

  /**
   * Save the default elevation
   */
  defaultElevation = 2;

  /**
   * 
   * @param dialog 
   * @param authService 
   * @param boatService 
   * @param db 
   * @param router 
   * @param afs 
   */
  constructor(public dialog: MatDialog, public authService: AuthService, private boatService: BoatService, public db: AngularFireDatabase, private router: Router, private afs: AngularFirestore)
  {
    /**
     * Get all boats
     */
    this.boatsRef = db.list(this.dbPath);
  }

  /**
   * Will be called at first
   */
  ngOnInit() {
    /**
     * Get all Boats
     */
    this.getBoatList(); 

    /**
     * Go through all boats
     */
    for(let i =0; i < parseInt(localStorage.getItem('numberOfBoats')); i++)
    {
      this.favRef = this.afs.doc(`${localStorage.getItem('userUid')}/${this.boat.brand + this.boat.name}`);
      this.favRef.valueChanges().subscribe(item => {
        
        /**
         * Check if item is not null
         */
        if(item != null)
        /**
         * Set favButton pressed to true or false
         */
          this.favButtonPressed = item.favourite
      });
    }
    /**
     * Set userId
     */
    this.userId = localStorage.getItem('userUid');
    /**
     * set feedback length
     */
    this.afs.collection(`${this.boat.brand + this.boat.name}`).valueChanges().subscribe(s => this.feedbackLength = s.length);

  }

  /**
   * Array to save all boats
   */
  boats: any = [];

  /**
   * Gets all Boats for feedback
   */
  getBoatsFeedbackList() {
    this.boatService.getBoatsList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(boats => {

      /**
       * Save boats to boats array
       */
      this.boats = boats;

      /**
       * Calls singleBoat
       */
      this.getSingleBoat();
    });
  }

  /**
   * Get all boats and sort them
   */
  getBoatList() {
    this.boatService.getBoatsList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(boats => {

      /**
       * Save to boats array and sort them
       */
      this.boats = boats.sort((n1, n2)=>
      {
        if (n1.rating < n2.rating) {
          return 1;
        }

        if (n1.rating > n2.rating) {
          return -1;
        }

        return 0;
      });
      /**
       * Set number of boats to localStorage
       */
      localStorage.setItem('numberOfBoats', this.boats.length);

      /**
       * Set all boats to localStorage()
       */
      localStorage.setItem('customerArray', JSON.stringify(this.boats));
    });
  }

  /**
   * Save the boat
   */
  boatNew: any = new BoatDTO;
  /**
   * Save the id of the boat
   */
  id:string = localStorage.getItem('boatForRating');
  
  /**
   * Save the rating of the boat
   */
  ratingBoat: number[];

  /**
   * Save the key of the boat
   */
  boatKey: string="";

  /**
   * Get a single boat
   * 
   * @returns a boat or null
   */
  getSingleBoat(): any{        

    /**
     * Set the number of boats
     */
    var c = localStorage.getItem('numberOfBoats');

    /**
     * Check if there are more than null boats
     */
    if(!isNaN(Number(c))){
      /**
       * Set counter
       */
      var counter = Number(c);

      /**
       * Go through the boat array
       */
      for(let i = 0; i < counter;i++){

        /**
         * Check if the boat has the same id
         */
        if(this.id == this.boats[i].key){
          /**
           * Save the data of the boat
           */
          this.boatNew = this.boats[i];

          /**
           * Save the ratings of the boat
           */
          this.ratingBoat = this.boatNew.allReatings;

          /**
           * Save the key of the boat
           */
          this.boatKey = this.boatNew.key;
        }
      }
      return this.boatNew;
    }
    else{
      console.log("Not a number!");
      return null;
    }
  }

  /**
   * Switch to image-slider page
   */
  openImageSlider(){
    this.router.navigateByUrl("/image-slider");
  }

  /**
   * Open logion dialog
   */
  confirmDialog(): void {
    /**
     * Message of the dialog
     */
    const message = `Do you wanna login now?`;

    /**
     * Data of the dialog
     */
    const dialogData = new ConfirmDialogModel("Not logged in!", message);

    /**
     * Open dialog
     */
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    /**
     * Will be called after closing dialog
     */
    dialogRef.afterClosed().subscribe(dialogResult => {

      /**
       * Check if there is a result
       */
      if(dialogResult){
        this.confirmSignIn();
      }
    });
  }

  /**
   * Set the current state of the boat
   * 
   * @param isActive -> state of the boat
   */
  updateActive(isActive: boolean) {
    this.boatService
      .updateBoat(this.boat.key, { active: isActive })
      .catch(err => console.log(err));
  }

  /**
   * Calls signIn component popup
   */
  confirmSignIn(): void{
    const dialogRef = this.dialog.open(SignInComponent, {
      maxWidth: "400px",
    });
  }

  /**
   * Will be edited ?
   */
  changeEditButton(){

    /**
     * Check if it is true
     */
    if(this.isEdit)
      /**
       * Set to false
       */
      this.isEdit = false;
    else
      /**
       * Set to true
       */
      this.isEdit = true;
  }

  /**
   * Methode which opens the edit dialog
   */
  confirmEditBoatDialog(): void {

    /**
     * Open edit dialog
     */
    const dialogRef = this.dialog.open(EditBoatComponent, {
      maxWidth: "900px"
    });

    /**
     * Will be called after close
     */
    dialogRef.afterClosed().subscribe(dialogResult => {
    });
  }

  /**
   * Save boat which will be edited
   */
  boatDTO : BoatDTO = null;

  /**
   * Methode to edit the photos of the boat
   * 
   * @param boatId -> id from the boat which will be edited
   * @param boatKey -> key of the boat which will be edited
   */
  editPhotoBoat(boatId: string, boatKey: string){
     this.boatsRef.valueChanges().subscribe(test => {
      test.forEach(item => {
       
        /**
         * Check if id is equal
         */
        if ((item.brand + item.name) == boatId){

          /**
           * Set key
           */
          item.key = boatKey;
          
          /**
           * Save the current boat
           */
          this.boatDTO = item;
          
          /**
           * Set data into localstorage
           * Set timeout to load all data from db
           */
          setTimeout(() => {localStorage.setItem('BoatToEdit', JSON.stringify(item));}, 5)
        }
      })
    });

    /**
     * Set timeout to load all data from db
     * 
     * And then open edit boat dialog
     */
    setTimeout(() => {this.confirmEditBoatDialog();}, 50)
  }

  /**
   * Update the boats in db
   * 
   * @param cus -> current boat
   */
  saveUpdateList(cus:BoatDTO) {
    /**
     * Check if userId is equal
     */
    if(this.boat.userId == localStorage.getItem('userUid')){
        this.boatService
        .updateBoat(cus.key, cus)
        .catch(err => console.log(err));
    }
    /**
     * Calls refresh methode
     */
    this.refreshPage();
  }

  /**
   * Methode to refresh the window
   */
  refreshPage() {
    window.location.reload();
  }

  /**
   * Methode to cancel Edit
   */
  cancelEdit(){
    /**
     * Set edit state to false
     */
    this.isEdit = false;

    /**
     * Refresh the page
     */
    this.refreshPage();
  }

  /**
   * Async methode to delete a boat
   */
  async deleteBoat() {

    /**
     * Set the length 
     */
    const length = this.feedbackLength;

    /**
     * Check if userId is equal
     */
    if(this.boat.userId == localStorage.getItem('userUid'))
    {
      /**
       * Confirm it
       */
      if(confirm("Are you sure to delete "+this.boat.name + "?"))
      {
        /**
         * Go through the db and delete it
         */
        for(let i = 0; i < this.userIds.length; i++){
          await this.afs.collection(this.userIds[i]).doc(`${this.boat.brand + this.boat.name}`).delete();
        }
        /**
         * Go through the db and delete it
         */
        for(let i = 0; i < length; i++){
          await this.afs.doc(`${this.boat.brand + this.boat.name}/${i}`).delete();
        }
        /**
         * Go through the db and delete it
         */
        this.boatService
        .deleteBoat(this.boat.key)
        .catch(err => console.log(err));
      }
    }
  }
  /**
   * 
   * @param brand -> of the boat
   * @param name -> of the boat
   */
  clickRating(brand, name){

    /**
     * Check if user is logged in
     */
    if(this.authService.isLoggedIn){
      /**
       * Set boat key to localstorage
       */
      localStorage.setItem('boatForRating', this.boat.key);

      /**
       * Set name of the boat to localstorage
       */
      localStorage.setItem('boatForRatingName', name);

      /**
       * Set the brand of the boat to localstorage
       */
      localStorage.setItem('boatForRatingBrand', brand);

      /**
       * Calls the methode getBoatsFeedbackList()
       */
      this.getBoatsFeedbackList();

      /**
       * Navigate to feedback side
       */
      this.router.navigateByUrl('/bewertung');
    }
    else
    /**
     * Open sign in dialog
     */
    this.confirmDialog();
  }

  /**
   * 
   * @param c -> current boat
   * @param fav -> state of favourite
   */
  clickFavButton(c:BoatDTO, fav:boolean){
    
    /**
     * If user is not logged in
     */
    if(!this.authService.isLoggedIn){

      /**
       * open sign in dialog
       */
      this.confirmDialog();
    }
    else{
      /**
       * Get the current boat
       */
      const favRef: AngularFirestoreDocument<any> = this.afs.doc(`${localStorage.getItem('userUid')}/${c.brand + c.name}`);
      
      /**
       * Set data of current boat
       */
      const favouriteData: any = {
        favourite: fav,
        boatId: c.key,
        userId: localStorage.getItem('userUid')
      };

      /**
       * Set fav state
       */
      this.favButtonPressed = fav;

      /**
       * Set data to db
       */
      favRef.set(favouriteData, {
        merge:true
      });
    }
  }

  /**
   * URL of the image
   * 
   * @param event -> current file
   */
  url;
  onSelectFile(event) {

    /**
     * Check if file is selected
     */
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
         this.url= (event.target as FileReader).result;  //event.target.result.toString();
         
         /**
          * Set image url
          */
         this.boat.imageUrl = this.url;

         /**
          * Update boat in db
          */
         this.boatService.updateBoat(this.boat.key, this.boat);
      }
    }
  }
}
