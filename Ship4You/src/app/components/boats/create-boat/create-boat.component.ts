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

  constructor(private boatService: BoatService, private router: Router, public authService: AuthService,
    public ngZone: NgZone, private storage: AngularFireStorage, private fs: FirebaseService,
    private afs: AngularFirestore
) { }

  ngOnInit() {
    this.getBoat();
    this.showPictures();
    this.showDocuments();
  }

  //Small animation for choosing an image
  isHovering: boolean;
  toggleHover(event: boolean) {
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

      this.boats = boats;
    });
  }

  //Checks if a boat id already exists (For example (Brand+Name): MaxusStern)
  checkID() : number{
    this.IDCounter = 0;
    for(let i = 0; i < this.boats.length; i++)
    {
      this.ID[this.IDCounter] = this.boats[i].brand+this.boats[i].name;
      this.IDCounter++;
    }

    for(var i = 0; i< this.IDCounter; i++){
      if(this.ID[i] === this.boat.brand+this.boat.name){
        this.boolCheck = false;
        return 0;
      }
      else if(this.boat.brand == "" ||  this.boat.name == ""){
        this.boolCheck = false;
        return 1;
      }
      else
        this.boolCheck = true;
    }
    if(this.boat.brand == null ||  this.boat.name == null || this.boat.cabins == null ||this.boat.length == null || this.boat.lessor == null
      || this.boat.location == null || this.boat.masts == null || this.boat.numberOfPeople == null || this.boat.vintage == null || this.boat.sail == null || this.boat.port == null || this.boat.linkToRentSide == null || this.boat.creatorEmail == null){
        this.boolCheck = false;
        return 2;
    }

    if(this.boolCheck)
      return -1;
    else
      this.IDCounter = 0;
  }

  //Save boat details and navigate to multiple upload site
  goToMultUpload(){
    if (this.description != null){
      localStorage.setItem("titlePictureDescription", this.description);
    }
    this.boatService.tmpBoat = this.boat;
    localStorage.setItem('tmpBoat', JSON.stringify(this.boat));
    localStorage.setItem('createBoatId', this.boat.brand+this.boat.name);
    this.router.navigateByUrl("multiple-upload");
  }

  //navigate to dashboard
  goToDashboard(){
    this.router.navigateByUrl("/dashboard");
  }

  //Upload title image of a boat
  detectFiles(event) {
    this.selectedFile = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = (event.target as FileReader).result;  //event.target.result.toString();
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
    this.selectedFile = event.target.files[0];
    this.fileName = event.target.files[0].name;
    var ext = this.fileName.substring(this.fileName.lastIndexOf('.') + 1);
    	if (ext.toLowerCase() == 'txt' || ext.toLowerCase() == 'pdf' || ext.toLowerCase() == 'xlsx') {
        this.fileEnd = ext.toLowerCase();
      }
    this.uploadFileDocuments();
  }

  //All uploaded documents
  uploadUrlArrayDocuments: Observable<String>[] = [];

  //Upload document to db
  uploadFileDocuments() {
    const myTest = this.afs.collection("documentUpload").ref.doc();
    const file = this.selectedFile
    const filePath = `${myTest.id}/name1`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercentDocument = task.percentageChanges();

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().toPromise().then( (url) => {
          this.downloadURLObservableDocument = url;
          this.uploadUrlArrayDocuments.push(this.downloadURLObservable);
          localStorage.setItem("downloadDocumentUrl", url);
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

    const myTest = this.afs.collection("test76").ref.doc();
    const file = this.selectedFile
    const filePath = `${myTest.id}/name1`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    this.uploadPercent = task.percentageChanges();

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().toPromise().then( (url) => {
          this.downloadURLObservable = url;
          this.uploadUrlArray.push(this.downloadURLObservable);
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
