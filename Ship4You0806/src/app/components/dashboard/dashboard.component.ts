import { Component, OnInit, NgZone } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from "../../shared/services/auth.service";
import {Subject} from 'rxjs';
import {startWith, map, window} from 'rxjs/operators';
import { Router } from "@angular/router";
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BoatData } from 'src/app/BoatData';
import { Picture } from 'src/app/Picture';
import {Observable, combineLatest} from 'rxjs'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

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

  //////
  search:String="";
  search2:String="";
  search3:String="";
  search4:String="";

  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();
//////////
  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    private afs: AngularFirestore
  ) { }

  ngOnInit() {

    this.notesCollection = this.afs.collection('boatData');
    this.notes = this.notesCollection.valueChanges();

    this.notes.forEach(element => {
      element.forEach(data =>{
        if(!this.allLocations.includes(data.location)){
          this.allLocations[this.arrayCounter]=data.location;
          this.allNames[this.arrayCounter]=data.name;
          this.allBrands[this.arrayCounter]=data.brand;
          this.allLessors[this.arrayCounter]=data.lessor;
          this.arrayCounter++;  
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
  files: File[] = [];


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

  firequery(start, end) {
    return this.afs.collection('boatData', ref => ref.limit(4).orderBy('location').startAt(start).endAt(end)).valueChanges();
  }

  //getAllBoats
  getallclubs() {

    return this.afs.collection('boatData', ref => ref.orderBy('location')).valueChanges();
  }

  boatsFound(){
    for(let boat of this.allBoats){
        if(boat.location.toUpperCase().includes(this.loc.toUpperCase())){
          return false;
        }
    }
    return true;
  }
}
