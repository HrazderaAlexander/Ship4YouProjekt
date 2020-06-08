import { Component, OnInit, NgZone } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from "../../shared/services/auth.service";
import {Subject} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import { Router } from "@angular/router";
import { Boat } from 'src/app/shared/services/boat';
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

  //////////

  startAt = new Subject();
  endAt = new Subject();

  boats;
  allBoats;

  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();
//////////
  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    private _formBuilder: FormBuilder, private afs: AngularFirestore
  ) {}

  ngOnInit() {

    this.notesCollection = this.afs.collection('boatData');
    this.notes = this.notesCollection.valueChanges();

    this.notesCollectionFiles = this.afs.collection('files');
    this.noteFiles = this.notesCollectionFiles.valueChanges();

    this.getallBoats().subscribe((location) => {
      this.allBoats = location;
      this.boats = this.allBoats;
    })
    combineLatest(this.startobs, this.endobs).subscribe((value) => {
      this.firequery(value[0], value[1]).subscribe((location) => {
        this.boats = location;
      })
    })

  }
  files: File[] = [];


  search($event) {
    let q = $event.target.value;
    if (q != '') {
      this.startAt.next(q);
      this.endAt.next(q + "\uf8ff");
    }
    else {
      this.boats = this.allBoats;
    }
  }

  firequery(start, end) {
    return this.afs.collection('boatData', ref => ref.limit(4).orderBy('location').startAt(start).endAt(end)).valueChanges();
  }

  getallBoats() {
    return this.afs.collection('boatData', ref => ref.orderBy('location')).valueChanges();
  }

}
