import { Component, OnInit, NgZone } from '@angular/core';
import {FormControl} from '@angular/forms';
import { AuthService } from "../../shared/services/auth.service";
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import { Router } from "@angular/router";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import {Observable} from 'rxjs'
import { BoatService } from '../boats/boat.service';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { Options } from '@angular-slider/ngx-slider';
import { SignInComponent } from '../sign-in/sign-in.component';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  /**
   * Save state if menu is open or not
   */
  menuOpen:boolean = false;

  /**
   * Save all boats
   */
  boats: any;

  /**
   * Variable to save all favourites from db
   */
  favRef: AngularFirestoreDocument<any>;

  /**
   * For searching
   */
  startAt = new Subject();
  endAt = new Subject();

  /**
   * Variable to save location
   */
  loc= ""
  /**
   * Variable to save name
   */
  boatName=""
  /**
   * Variable to check if page is loaded
   */
  isLoaded: boolean = false;
  
  /**
   * Variables for filtering
   */
  searchLocationString:string="";
  searchBoatNameString:string="";
  searchLessorString:string="";
  searchBrandString:string="";
  searchPortString:string="";

  /**
   * FavModel to save favourite boat
   */
  favModel: any;

  /**
   * Searching
   */
  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();

  /**
   * Variable to save feedback data
   */
  feedbackData : any;

  /**
   * Variable to save all favourite boats
   */
  favBoats: any[] = [];

  /**
   * Variable to save sorted favourite boats
   */
  favBoatsSort: any[] = [];

  /**
   * Save the count of favourite boats
   */
  countFav = 0;

  /**
   * Visible or disable favourite boats
   */
  showFav: boolean = false;

  /**
   * 
   * @param dialog 
   * @param authService 
   * @param router 
   * @param ngZone 
   * @param afs 
   * @param service 
   * @param boatService 
   * @param datePipe 
   */
  constructor(public dialog: MatDialog, public authService: AuthService, public router: Router, public ngZone: NgZone,private afs: AngularFirestore, private boatService: BoatService, private datePipe:DatePipe)
  {
  }

  /**
   * Save all images
   */
  imageList: any[];

  /**
   * Save all favourite booleans
   */
  fav:boolean[]=[];

  /**
   * Options for the filtering items
   */
  value: number = 0;
  highValue: number = 100;
  options: Options = {
    floor: 0,
    ceil: 100
  };

  //sails-Slider
  sailsValue: number = 0;
  sailsHighValue: number = 10;
  optionsSails: Options = {
    floor: 0,
    ceil: 10
  };

  //masts-Slider
  mastsValue: number = 0;
  mastsHighValue: number = 10;
  optionsMasts: Options = {
    floor: 0,
    ceil: 10
  };

  //cabins-Slider
  cabinsValue: number = 0;
  cabinsHighValue: number = 100;
  optionsCabins: Options = {
    floor: 0,
    ceil: 100
  };

  //year-Slider
  yearValue: number = 1800;
  yearHighValue: number = parseInt(this.datePipe.transform(Date.now(), 'yyyy'));
  optionsYear: Options = {
    floor: 1800,
    ceil: parseInt(this.datePipe.transform(Date.now(), 'yyyy'))
  }

  //amountPeople-Slider
  amountPeopleValue: number = 1;
  amountPeopleHighValue: number = 100;
  optionsAmountPeople: Options = {
    floor: 1,
    ceil: 100
  };

  /**
   * Save all userIds
   */
  allUserIds : string[] = [];
  
  /**
   * Save the userId count
   */
  userIdCounter = 0;

  /**
   * Controls of the data fiels
   */
  myControl = new FormControl();
  namesControl = new FormControl();
  lessorControl = new FormControl();
  brandControl = new FormControl();
  portControl = new FormControl();
  
  /**
   * Save filtering options
   */
  filteredOptions: Observable<string[]>;
  filteredLocations: Observable<string[]>;
  filteredLessors: Observable<string[]>;
  filteredBrand: Observable<string[]>;
  filteredPort: Observable<string[]>;

  /**
   * Will be called at first
   */
  ngOnInit() {

    /**
     * Get all boats
     */
    this.getBoatList();

    /**
     * Set localstorage
     */
    this.afs.collection('users').valueChanges().subscribe(s => localStorage.setItem('size', `${s.length}`));

    /**
     * Set ref collection
     */
    const ref = this.afs.collection('users');
    const snapshot = ref.get();

    /**
     * Set user data
     */
    snapshot.forEach(doc => {
      doc.forEach(d => {
        this.allUserIds[this.userIdCounter] = d.id;
        this.userIdCounter++;
      })
      /**
       * Set all user to localstorage
       */
      localStorage.setItem('userIds', JSON.stringify(this.allUserIds));
    });
  }

  /**
   * Methode to get all boats
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
       * Set all boats sorted
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
       * Set number of boats to localstorage
       */
      localStorage.setItem('numberOfBoats', this.boats.length);

      /**
       * Set all boats to localstorage
       */
      localStorage.setItem('customerArray', JSON.stringify(this.boats));
    });
  }

  /**
   * Methode to get all favourite boats
   */
  getAllFavBoats(){

    /**
     * Check the state of favourites
     */
    if(!this.showFav)
    {
      /**
       * Set showFav to true
       */
      this.showFav = true;

      /**
       * Go through all boats
       */
      for(let i = 0; i < parseInt(localStorage.getItem('numberOfBoats')); i++)
      {
        /**
         * Get the favourite boats
         */
        this.favRef = this.afs.doc(`${localStorage.getItem('userUid')}/${this.boats[i].brand + this.boats[i].name}`);
        
        this.favRef.valueChanges().subscribe(item =>
          {
            this.favModel = item;
            /**
             * Check if id is euqal
             */
            if(!this.favBoats.includes(this.boats[i]) && this.favModel.boatId == this.boats[i].key && this.favModel.favourite){
              
              /**
               * Set favboats to this.boats
               */
              this.favBoats[this.countFav] = this.boats[i];
              
              /**
               * Set count one higher
               */
              this.countFav++;
              /**
               * Sort boats
               */
              this.favBoatsSort = this.favBoats.sort((n1,n2) => {
                if (n1.rating < n2.rating) {
                    return 1;
                }

                if (n1.rating > n2.rating) {
                    return -1;
                }

                return 0;
              });
            }
          });
      }
    }
    else{
      /**
       * Set showFav to false
       */
      this.showFav = false;

      /**
       * Clear array of favourite boats
       */
      this.favBoats= [];

      /**
       * Clear array of sorted favourite boats
       */
      this.favBoatsSort=[];

      /**
       * Set favModel to null
       */
      this.favModel = null;

      /**
       * Set the favourite boat count to 0
       */
      this.countFav = 0;
    }
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

        /**
         * Switch to sign in page
         */
        this.router.navigateByUrl('sign-in');
      }
    });
  }

  /**
   * Calls signIn component popup
   */
  confirmSignIn(): void{
    const dialogRef = this.dialog.open(SignInComponent, {
      maxWidth: "400px",
    });

    /**
     * Will be called after closing dialog
     */
    dialogRef.afterClosed().subscribe(x => {
      /**
       * After closing and user is logged in reload page
       */
      if(!x && this.authService.isLoggedIn)
        location.reload();
    })
  }

  /**
   * Calls sign up popup
   */
  confirmSignUp():void {
    const dialogRef = this.dialog.open(SignUpComponent, {
      maxWidth: "400px",
    });

    /**
     * Will be called after closing dialog
     */
    dialogRef.afterClosed().subscribe(x => {
      /**
       * After closing and user is logged in reload page
       */
      if(!x && !this.authService.isLoggedIn)
        location.reload();
    })
  }

  /**
   * Methode to open and close menu
   */
  openMenu(){
    /**
     * Check is menu is not open
     */
    if(!this.menuOpen)
      /**
       * Set menuOpen to true
       */
      this.menuOpen = true;
    else
      /**
       * Set menu open to false
       */
      this.menuOpen = false;
  }
}
