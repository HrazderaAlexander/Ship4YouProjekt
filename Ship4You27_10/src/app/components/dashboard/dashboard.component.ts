import { Component, OnInit, NgZone } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from "../../shared/services/auth.service";
import {Subject} from 'rxjs';
import {startWith, map, window} from 'rxjs/operators';
import { NavigationEnd, Router } from "@angular/router";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { BoatData } from 'src/app/BoatData';
import { Picture } from 'src/app/Picture';
import {Observable, combineLatest} from 'rxjs'
import { ImageService } from 'src/app/shared/image.service';
import { CustomerService } from '../customers/customer.service';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { Options } from '@angular-slider/ngx-slider';
import { FavModel } from 'src/app/shared/services/favModel';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  formatLabel(value: number) {
    return value + 'm';
  }
  formatLabelYear(value: number) {
    return value;
  }

  menuOpen:boolean = false;
  customers: any;
  selected = 'option2';

  notesCollection: AngularFirestoreCollection<BoatData>;
  notes:Observable<BoatData[]>;
  notesCollectionFiles: AngularFirestoreCollection<Picture>;
  noteFiles:Observable<Picture[]>;

  favRef: AngularFirestoreDocument<any>;

  //Safe all locations from firebase
  allLocations:String[] = [];
  arrayCounter:number=0;

  allNames:String[] = [];

  allBrands:String[] = [];

  allLessors:String[] = []; //Vermieter

  startAt = new Subject();
  endAt = new Subject();

  boats;
  allBoats = [];

  loc= ""
  boatName=""

  isLoaded: boolean = false;

  //Button
  locationButtonBool: boolean = true;
  nameButtonBool: boolean = true;

  //////
  searchLocationString:string="";
  searchBoatNameString:string="";
  searchLessorString:string="";
  searchBrandString:string="";

  isUsedBoolean:Boolean = false;

  favModel: any;

  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();
//////////
navigationSubscription;

feedbackData : any;
favCustomer: any[] = [];
favCustomerSort: any[] = [];
countFav = 0;

showFav: boolean = false;

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    private afs: AngularFirestore, private service: ImageService, private customerService: CustomerService
  ) {  }

  imageList: any[];
  rowIndexArray: any[];

  fav:boolean[]=[];

  size = 0;
  
  //length-Slider
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
  yearHighValue: number = 2030;
  optionsYear: Options = {
    floor: 1800,
    ceil: 2030
  }
  //amountPeople-Slider
  amountPeopleValue: number = 1;
  amountPeopleHighValue: number = 100;
  optionsAmountPeople: Options = {
    floor: 1,
    ceil: 100
  };
  getValues(value, highValue){
    console.log(value);
    console.log(highValue);
  }
  allUserIds : string[] = [];
  userIdCounter = 0;

  ngOnInit() {

    this.getCustomersList();
    this.afs.collection('users').valueChanges().subscribe(s => localStorage.setItem('size', `${s.length}`));

    const ref = this.afs.collection('users');
    const snapshot = ref.get();
    snapshot.forEach(doc => {
      doc.forEach(d => {
        this.allUserIds[this.userIdCounter] = d.id;
        console.log('insert ' + this.userIdCounter + ': ' + d.id);
        this.userIdCounter++;
      })
      console.log(this.allUserIds);
      localStorage.setItem('userIds', JSON.stringify(this.allUserIds));
    });
    //Zugreifen auf die Daten von der Datebnbank
    this.notesCollection = this.afs.collection('boatData');
    this.notes = this.notesCollection.valueChanges();

    this.notes.forEach(element => {
      element.forEach(data =>{
        if(!this.allLocations.includes(data.location)){
          this.allLocations[this.arrayCounter]=data.location;
        }
        if (!this.allNames.includes(data.name)){
          this.allNames[this.arrayCounter]=data.name;
          this.isUsedBoolean = true;
        }
        if (!this.allBrands.includes(data.brand)){
          this.allBrands[this.arrayCounter]=data.brand;
          this.isUsedBoolean = true;
        }
        if (!this.allLessors.includes(data.lessor)){
          this.allLessors[this.arrayCounter]=data.lessor;
          this.isUsedBoolean = true;
        }
        if (this.isUsedBoolean == true)
        {
          this.arrayCounter++;  
          this.isUsedBoolean = false;
        }
      })
    });

    this.notesCollectionFiles = this.afs.collection('files');
    this.noteFiles = this.notesCollectionFiles.valueChanges();

    this.getallclubs().subscribe((location) => {
      this.allBoats = location;
      this.boats = this.allBoats;
      console.log(this.allBoats);
    })
  }
  files = [];

  getCustomersList() {
    this.customerService.getCustomersList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(customers => {

      this.customers = customers.sort((n1, n2)=> 
      {
        if (n1.rating < n2.rating) {
          return 1;
        }

        if (n1.rating > n2.rating) {
          return -1;
        }

        return 0;
      });    

      for(let i = 0; i < this.customers.length;){
        if(!this.allLocations.includes(this.customers[i].location)){
          this.allLocations[this.arrayCounter]=this.customers[i].location;
          this.arrayCounter++;
        }
        else 
          i++;
      }
      this.arrayCounter = 0;

      for(let i = 0; i < this.customers.length;){
        if (!this.allBrands.includes(this.customers[i].brand)){
          this.allBrands[this.arrayCounter]=this.customers[i].brand;
          this.arrayCounter++;
        }
        else 
          i++;
      }

      this.arrayCounter = 0;

      for(let i = 0; i < this.customers.length;){
        if (!this.allLessors.includes(this.customers[i].lessor)){
          this.allLessors[this.arrayCounter]=this.customers[i].lessor;
          this.arrayCounter++;
        }
        else 
          i++;
      }

      this.arrayCounter = 0;

      for(let i = 0; i < this.customers.length;){
        if (!this.allNames.includes(this.customers[i].name)){
          this.allNames[this.arrayCounter]=this.customers[i].name;
          this.arrayCounter++;
        }
        else 
          i++;
      }
      localStorage.setItem('numberOfBoats', this.customers.length);
    });
  }

  deleteCustomers() {
    this.customerService.deleteAll().catch(err => console.log(err));
  }


  //Nach Location suchen in der Datenbank
  searchLocation($event) {
  
    let q = $event.target.value;
    this.loc = q
    if (q != '') {
      this.startAt.next(q);
      this.endAt.next(q + "\uf8ff");
      this.boats = location
    }
    else if (q == '')
      this.boats = this.allBoats
  }

  //Gibt eine Collection in der 4 Boot nach Location geordnet sind zurück
  firequery(start, end) {
    return this.afs.collection('boatData', ref => ref.limit(4).orderBy('location').startAt(start).endAt(end)).valueChanges();
  }

  //getAllBoats
  getallclubs() {

    return this.afs.collection('boatData', ref => ref.orderBy('location')).valueChanges();
  }

  getallFiles(){
    return this.afs.collection('files').valueChanges();
  }

  getAllFavBoats(){
    if(!this.showFav)
    {
      this.showFav = true;
      for(let i = 0; i < parseInt(localStorage.getItem('numberOfBoats')); i++)
      {
        this.favRef = this.afs.doc(`${localStorage.getItem('userUid')}/${this.customers[i].brand + this.customers[i].name}`);
        this.favRef.valueChanges().subscribe(item => 
          {
            this.favModel = item;
              if(!this.favCustomer.includes(this.customers[i]) && this.favModel.boatId == this.customers[i].key && this.favModel.favourite){
                this.favCustomer[this.countFav] = this.customers[i];
                this.countFav++;
                this.favCustomerSort = this.favCustomer.sort((n1,n2) => {          
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
      this.showFav = false;
      this.favCustomer= []; 
      this.favModel = null;
      this.countFav = 0;    
    }
  }

  //Ob ein Boat an der bestimmten Location gefunden wurde.
  boatsFound(){
    for(let boat of this.allBoats){
        if(boat.location.toUpperCase().includes(this.loc.toUpperCase())){
          return false;
        }
    }
    return true;
  }

  resetSearchData(){
    this.searchLocationString = "";
    this.searchBoatNameString = "";
    this.searchLessorString = "";
    this.searchBrandString = "";
  }

  confirmDialog(): void {
    const message = `Do you wanna login now?`;
 
    const dialogData = new ConfirmDialogModel("Not logged in!", message);
 
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });
 
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult){
        this.router.navigateByUrl('sign-in');
      }
    });
  }

  openMenu(){
    if(!this.authService.isLoggedIn){
      this.confirmDialog();
    }
    else{
      if(!this.menuOpen)
        this.menuOpen = true;
      else
        this.menuOpen = false;
    }
  }
}