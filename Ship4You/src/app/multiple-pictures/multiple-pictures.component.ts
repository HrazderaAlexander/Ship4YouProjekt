import { AuthService } from 'src/app/shared/services/auth.service';
import { Component, OnInit  } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseService } from '../../app/shared/services/firebase.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { BoatDTO } from '../components/boats/boat';
import { BoatService } from '../components/boats/boat.service';

export interface Test {
  imagenDestacada: string;
}

@Component({
  selector: 'app-multiple-pictures',
  templateUrl: './multiple-pictures.component.html',
  styleUrls: ['./multiple-pictures.component.css']
})
export class MultiplePicturesComponent implements OnInit {

  uploadPercent: Observable<number>;
  downloadURL: Observable<string>[] = [];
  selectedFile: FileList | null;
  forma: FormGroup;
  tests: Observable<any[]>;

  newBoat: BoatDTO = new BoatDTO();

  tmp: string = "";
  description: string;

  pictureDescriptionArray: string[] = [];

  constructor(fb: FormBuilder, private boatService: BoatService, private router: Router, public authService: AuthService, private storage: AngularFireStorage, private afs: AngularFirestore, private fs: FirebaseService ) {
    this.forma = fb.group ({
      categoria: ['myCategoria'],

    })
  }

  ngOnInit() {
    this.newBoat = JSON.parse(localStorage.getItem('tmpBoat'));
    console.log("NewBoatInit " + this.newBoat);
    this.mostrarImagenes();
  }

  save() {
    //this.customer.imageUrl = "https://firebasestorage.googleapis.com/v0/b/ship4you-36b43.appspot.com/o/1600897207082_Retana24.jpeg?alt=media&token=bc63b384-7b18-437e-bd86-9b4e13dd05ae";
    this.newBoat.imageUrl = localStorage.getItem('downloadUrl');
    this.newBoat.documentUrl = localStorage.getItem('downloadDocumentUrl');
    //this.newBoat.picturesUrl = JSON.parse(localStorage.getItem("downloadMultiPictures"));
    localStorage.removeItem("downloadMultiPictures");
    localStorage.removeItem("downloadDocumentUrl");
    localStorage.removeItem('downloadUrl');
    this.newBoat.userId = localStorage.getItem('userUid');
    this.newBoat.allReatings = [0];
    this.newBoat.picturesUrl = this.downloadURL;
    if (this.pictureDescriptionArray != null){
      this.newBoat.pictureDescriptionArray = this.pictureDescriptionArray;
    }

    console.log("IsLocNull " + localStorage.getItem("titlePictureDescription"))
    if (localStorage.getItem("titlePictureDescription") != null){
      this.newBoat.titlePictureDescription = localStorage.getItem("titlePictureDescription");
      console.log("TitlePicture " + this.newBoat.titlePictureDescription);
    }
    this.newBoat.rating = 0;
    this.boatService.createBoat(this.newBoat);
    this.newBoat = new BoatDTO();
    this.downloadURL = [];
  }

  onSubmit() {
    if (this.description != null){
      this.pictureDescriptionArray.push(this.description);
    }
    this.save();
    this.router.navigateByUrl("/dashboard");
  }

  detectFiles(event) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    console.log('TEST createBoatId: ', localStorage.getItem("createBoatId"));
    const myTest = this.afs.collection(localStorage.getItem("createBoatId")+"Mult").ref.doc();
    console.log(myTest.id)

    const file = this.selectedFile
    const filePath = `${myTest.id}/name1`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    this.uploadPercent = task.percentageChanges();

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().toPromise().then( (url) => {
          this.downloadURL.push(url);
          myTest.set({
            categoria: this.forma.value.categoria,
            imagenes : this.downloadURL,
            myId : myTest.id
          })
          console.log( this.downloadURL )
        }).catch(err=> { console.log(err) });
      })
    )
    .subscribe()
  }

  mostrarImagenes() {
    this.tests = this.fs.getTests();
  }

}
