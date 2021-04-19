import { Component, NgZone, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ImageService } from 'src/app/shared/image.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { finalize, map } from 'rxjs/operators';
import { BoatDTO } from '../boat';
import { BoatService } from '../boat.service';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormGroup } from '@angular/forms';
import { FirebaseService } from 'src/app/shared/services/firebase.service';

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

  boat: BoatDTO = new BoatDTO();
  submitted = false;
  boats: BoatDTO[] = [];

  ID : string[] = [];
  IDCounter : number = 0;
  boolCheck : boolean = false;

  selectedFile: FileList | null;
  uploadPercent: Observable<number>;
  uploadPercentDocument: Observable<number>;
  downloadURLObservable: Observable<string>;
  downloadURLObservableDocument: Observable<string>;
  forma: FormGroup;
  tests: Observable<any[]>;

  description: string;

  constructor(private boatService: BoatService, private router: Router, public authService: AuthService,
    public ngZone: NgZone, private storage: AngularFireStorage, private fs: FirebaseService,
    private afs: AngularFirestore, private service: ImageService
) { }

  ngOnInit() {
    this.getBoat();
    this.mostrarImagenes();
    this.mostrarDocuments();
  }

  isHovering: boolean;

  files: File[] = [];
  filesDocuments: File[] = [];
  filesPictures: File[] = [];

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  types: Types[] = [
    {value: 'Sailingboat', viewValue: 'Sailingboat'},
    {value: 'Motorboat', viewValue: 'Motorboat'}
  ]

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      //Picture.saveFilePath = this.boatBrand + this.boatName;
      if (!this.validateFile(files[0].name)) {
        console.log('Selected file format is not supported');
        alert("Selected file format is not supported! (Allowed: .jpeg, .jpg, .png)");
        return false;
      }
      else{
        if(this.checkID() == -1){
          this.files.push(files.item(i));
        }
        else{
          alert("All fields are required!");
        }
      }
    }
  }

  onDropMult(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      //Picture.saveFilePath = this.boatBrand + this.boatName;
      if (!this.validateFile(files[0].name)) {
        console.log('Selected file format is not supported');
        alert("Selected file format is not supported! (Allowed: .jpeg, .jpg, .png)");
        return false;
      }
      else{
        if(this.checkID() == -1){
          this.filesPictures.push(files.item(i));
        }
        else{
          alert("All fields are required!");
        }
      }
    }
  }

  onDropDocument(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      //Picture.saveFilePath = this.boatBrand + this.boatName;
      if (!this.validateDocument(files[0].name)) {
        console.log('Selected file format is not supported');
        alert("Selected file format is not supported! (Allowed: .docx, .pdf, .xlsx, .txt)");
        return false;
      }
      else{
        if(this.checkID() == -1){
          this.filesDocuments.push(files.item(i));
        }
        else{
          alert("All fields are required!");
        }
      }
    }
  }

  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'png' || ext.toLowerCase() == 'jpeg' || ext.toLowerCase() == 'jpg') {
        return true;
    }
    else {
        return false;
    }
}
validateDocument(name: String) {
  var ext = name.substring(name.lastIndexOf('.') + 1);
  if (ext.toLowerCase() == 'docx' || ext.toLowerCase() == 'pdf' || ext.toLowerCase() == 'xlsx') {
      return true;
  }
  else {
      return false;
  }
}

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

    checkID() : number{
      this.IDCounter = 0;
      for(let i = 0; i < this.boats.length; i++)
      {
        //console.log(this.boats[i].brand+this.boats[i].name);
        this.ID[this.IDCounter] = this.boats[i].brand+this.boats[i].name;
        //console.log(localStorage.getItem("createBoatId"));
        this.IDCounter++;
      }
      //console.log(this.IDCounter);

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

  goToMultUpload(){
    //
    console.log("Desc " + this.description);
    if (this.description != null){
      localStorage.setItem("titlePictureDescription", this.description);
    }
    //


    this.boatService.tmpBoat = this.boat;
    localStorage.setItem('tmpBoat', JSON.stringify(this.boat));
    console.log("TmpBoat " + this.boatService.tmpBoat)
    localStorage.setItem('createBoatId', this.boat.brand+this.boat.name);
    console.log(localStorage.getItem("createBoatId"));
    this.router.navigateByUrl("multiple-upload");
  }

  goToDashboard(){
    this.router.navigateByUrl("/dashboard");
  }

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

  fileName: string;
  fileEnd: string;

  detectFilesDocuments(event) {
    this.selectedFile = event.target.files[0];

    this.fileName = event.target.files[0].name;

    console.log("FileNAME: " + this.fileName)

    var ext = this.fileName.substring(this.fileName.lastIndexOf('.') + 1);

    	if (ext.toLowerCase() == 'txt' || ext.toLowerCase() == 'pdf' || ext.toLowerCase() == 'xlsx') {
        this.fileEnd = ext.toLowerCase();
        console.log("FILEEND: " + this.fileEnd);
      }

    this.uploadFileDocuments();
  }
  uploadUrlArrayDocuments: Observable<String>[] = [];

  uploadFileDocuments() {

    const myTest = this.afs.collection("documentUpload").ref.doc();
    //console.log(myTest.id)

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

  mostrarDocuments() {
    this.tests = this.fs.getDocumentsCreate();
  }

  uploadUrlArray: Observable<String>[] = [];
url;
  uploadFile() {

    const myTest = this.afs.collection("test76").ref.doc();
    //console.log(myTest.id)
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

  mostrarImagenes() {
    this.tests = this.fs.getTestCreate();
  }
}
