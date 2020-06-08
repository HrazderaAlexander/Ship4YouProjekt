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

  boatName:string;
  boatType:string;
  boatVintage: number;
  boatLocation:string;
  boatLessor:string;
  boatCabins:string;
  boatLength:string;
  boatSail:string;
  boatNumberOfPeople:string;
  boatMasts:string;
  boatPicturesPath:string;

  selectedImage: any = null;

  url:string;
  //id:string;
  file:string;
  _db:AngularFirestore;
  //notesCollection: AngularFirestoreCollection<BoatData>
  //notes: Observable<BoatData[]>;

  constructor(public authService: AuthService, @Inject(AngularFireStorage) private storage: AngularFireStorage, @Inject(FileService) private fileService: FileService, 
  private db: AngularFirestore, private afs: AngularFirestore) {
    this._db = db;
   }

  ngOnInit() {
    //this.notesCollection = this.afs.collection('boatData');
    //this.notes = this.notesCollection.valueChanges();
    this.fileService.getImageDetailList();
  }

  addData()
  {
    let boatDataCollection = this._db.collection<BoatData>('boatData');
    boatDataCollection.add({type: this.boatType, name: this.boatName, vintage: this.boatVintage, location: this.boatLocation, 
    lessor: this.boatLessor, cabins: this.boatCabins, length: this.boatLength, sail: this.boatSail, numberOfPeople: this.boatNumberOfPeople,
    masts: this.boatMasts, boatPicturesPath: this.boatPicturesPath})
  }

  isHovering: boolean;

  files: File[] = [];

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      Picture.saveFilePath = this.boatType + this.boatName;
      //this.boatPicturesPath = Picture.saveFilePath;
      this.files.push(files.item(i));
    }
  }

}
