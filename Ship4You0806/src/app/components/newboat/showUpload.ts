import { Component, Inject } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from "../../shared/services/auth.service";
import { finalize } from "rxjs/operators";
import { FileService } from './Services/file.service';
import { Picture } from '../../Picture';
import { compileBaseDefFromMetadata } from '@angular/compiler';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore'
import { BoatData } from 'src/app/BoatData';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './showUpload.html',
  styleUrls: ['./showUpload.scss']
})

export class ShowUpload{

  boatName:string = "";
  boatType:string;
  boatBrand:string = "";
  boatVintage: number;
  boatLocation:string;
  boatLessor:string;
  boatCabins:number;
  boatLength:number;
  boatSail:number;
  boatNumberOfPeople:number;
  boatMasts:number;

  selectedImage: any = null;

  ID : string[] = [];
  IDCounter : number = 0;
  boolCheck : boolean = false; //0 BoatBrand+Boatname  1 Both is "" -1 Keinen Fehler

  url:string;
  //id:string;
  file:string;
  _db:AngularFirestore;
  notesCollection: AngularFirestoreCollection<BoatData>
  notes: Observable<BoatData[]>;

  constructor(public authService: AuthService, @Inject(AngularFireStorage) private storage: AngularFireStorage, @Inject(FileService) private fileService: FileService, 
  private db: AngularFirestore, private afs: AngularFirestore) {
    this._db = db;
   }

  ngOnInit() {
    this.notesCollection = this.afs.collection('boatData');
    this.notes = this.notesCollection.valueChanges();
    this.fileService.getImageDetailList();
  }

  addData()
  {
    let boatDataCollection = this._db.collection<BoatData>('boatData').doc(this.boatBrand + this.boatName);
    boatDataCollection.set({type: this.boatType, name: this.boatName, vintage: this.boatVintage, brand: this.boatBrand, location: this.boatLocation, 
    lessor: this.boatLessor, cabins: this.boatCabins, length: this.boatLength, sail: this.boatSail, numberOfPeople: this.boatNumberOfPeople,
    masts: this.boatMasts})
  }

  isHovering: boolean;

  files: File[] = [];

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      Picture.saveFilePath = this.boatBrand + this.boatName;
      this.files.push(files.item(i));
    }
  }

  checkID() : number{
    this.notes.forEach(element =>{
      element.forEach(data => {
        this.ID[this.IDCounter] = data.brand+data.name;
        this.IDCounter++;
      })
    })

    for(var i = 0; i< this.IDCounter; i++){
      if(this.ID[i] === this.boatBrand+this.boatName){
        this.boolCheck = false;
        return 0;
      }
      else if(this.boatBrand == "" ||  this.boatName == ""){
        this.boolCheck = false;
        return 1;
      }
      else if(this.boatBrand == "" ||  this.boatName == ""){
        this.boolCheck = false;
        return 2;
      }
      else
        this.boolCheck = true;
    }

    if(this.boolCheck)
      return -1;
    else
      this.IDCounter = 0;
  }

}
