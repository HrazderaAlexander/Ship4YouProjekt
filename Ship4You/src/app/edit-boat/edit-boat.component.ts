import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, ProgressSpinnerMode, ThemePalette } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { BoatDTO } from '../components/boats/boat';
import { BoatService } from '../components/boats/boat.service';
import { AuthService } from '../shared/services/auth.service';
import { FirebaseService } from '../shared/services/firebase.service';

@Component({
  selector: 'app-edit-boat',
  templateUrl: './edit-boat.component.html',
  styleUrls: ['./edit-boat.component.scss']
})
export class EditBoatComponent implements OnInit {

  uploadPercent: Observable<number>;
  downloadURL: Observable<string>[] = [];
  selectedFile: FileList | null;
  forma: FormGroup;
  tests: Observable<any[]>;

  newBoat: BoatDTO = new BoatDTO();

  tmp: string = "";
  description: string;

  pictureDescriptionArray: string[] = [];

  constructor(fb: FormBuilder, private boatService: BoatService, public dialogRef: MatDialogRef<EditBoatComponent>, @Inject(MAT_DIALOG_DATA) private router: Router, public authService: AuthService, private storage: AngularFireStorage, private afs: AngularFirestore, private fs: FirebaseService ) {
    this.forma = fb.group ({
      categoria: ['myCategoria'],

    })
  }

  ngOnInit() {
    this.newBoat = JSON.parse(localStorage.getItem('BoatToEdit'));
    console.log("NewBoatInit " + this.newBoat);
    this.mostrarImagenes();
  }

  save() {
    //this.customer.imageUrl = "https://firebasestorage.googleapis.com/v0/b/ship4you-36b43.appspot.com/o/1600897207082_Retana24.jpeg?alt=media&token=bc63b384-7b18-437e-bd86-9b4e13dd05ae";

    this.startLoading();
    console.log("Key " + this.newBoat.picturesUrl)
    this.boatService.updateBoat(this.newBoat.key, this.newBoat);
    //setTimeout(() => {location.reload()}, 5000)
    location.reload();
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
    this.uploadFile();
  }

  onConfirm(): void {
    this.dialogRef.close(false);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
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
          this.newBoat.picturesUrl.push(url);
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
    console.log('TESTS: ', this.tests);
  }

  deleteImage(image:Observable<string>){

    console.log("image" +image)
    this.newBoat.picturesUrl.forEach(img => {
      if(img == image){
        this.newBoat.picturesUrl.splice(this.newBoat.picturesUrl.indexOf(image),1);
      }
    })
  }

  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  check = false;
  
  startLoading(){
    this.check=true;
    console.log('check: ', this.check);
  }
}
