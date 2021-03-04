import { Component, NgZone, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ImageService } from 'src/app/shared/image.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { map } from 'rxjs/operators';
import { BoatDTO } from '../boat';
import { BoatService } from '../boat.service';

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

  constructor(private boatService: BoatService, private router: Router, public authService: AuthService,
    public ngZone: NgZone,
    private afs: AngularFirestore, private service: ImageService
) { }

  ngOnInit() {
    this.getBoat();
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
        console.log(this.boats[i].brand+this.boats[i].name);
        this.ID[this.IDCounter] = this.boats[i].brand+this.boats[i].name;
        console.log(localStorage.getItem("createBoatId"));
        this.IDCounter++;
      }
      console.log(this.IDCounter);

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
    this.boatService.tmpBoat = this.boat;
    localStorage.setItem('tmpBoat', JSON.stringify(this.boat));
    console.log("TmpBoat " + this.boatService.tmpBoat)
    localStorage.setItem('createBoatId', this.boat.brand+this.boat.name);
    console.log(localStorage.getItem("createBoatId"));
    this.router.navigateByUrl("multiple-upload");
  }
}
