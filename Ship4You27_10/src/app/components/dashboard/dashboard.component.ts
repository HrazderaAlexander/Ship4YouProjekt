import { Component, OnInit, NgZone } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from "../../shared/services/auth.service";
import {Subject} from 'rxjs';
import {startWith, map, window} from 'rxjs/operators';
import { NavigationEnd, Router } from "@angular/router";
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BoatData } from 'src/app/BoatData';
import { Picture } from 'src/app/Picture';
import {Observable, combineLatest} from 'rxjs'
import { ImageService } from 'src/app/shared/image.service';
import { CustomerService } from '../customers/customer.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  customers: any;
  selected = 'option2';

  notesCollection: AngularFirestoreCollection<BoatData>;
  notes:Observable<BoatData[]>;
  notesCollectionFiles: AngularFirestoreCollection<Picture>;
  noteFiles:Observable<Picture[]>;

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

  //Button
  locationButtonBool: boolean = true;
  nameButtonBool: boolean = true;

  //////
  searchLocationString:string="";
  searchBoatNameString:string="";
  searchLessorString:string="";
  searchBrandString:string="";

  isUsedBoolean:Boolean = false;

  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();
//////////
navigationSubscription;

  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    private afs: AngularFirestore, private service: ImageService, private customerService: CustomerService
  ) {  }

  imageList: any[];
  rowIndexArray: any[];

  ngOnInit() {
    this.getCustomersList();
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

    combineLatest(this.startobs, this.endobs).subscribe((value) => {
      this.firequery(value[0], value[1]).subscribe((location) => {
        this.boats = location;
      })
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

      this.customers = customers;

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
}
