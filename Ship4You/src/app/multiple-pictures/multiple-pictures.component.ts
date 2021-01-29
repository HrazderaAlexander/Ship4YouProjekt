import { Component, OnInit  } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseService } from '../../app/shared/services/firebase.service';
import { AngularFireStorage } from '@angular/fire/storage';

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
  downloadURL: Observable<string>;
  selectedFile: FileList | null;
  forma: FormGroup;
  tests: Observable<any[]>;

  tmp: string = "";

  constructor(fb: FormBuilder, private storage: AngularFireStorage, private afs: AngularFirestore, private fs: FirebaseService ) { 
    this.forma = fb.group ({
      categoria: ['myCategoria'],

    })
  }

  ngOnInit() {
    this.mostrarImagenes();
  }

  detectFiles(event) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    this.tmp = localStorage.getItem("createBoatId");
    const myTest = this.afs.collection(this.tmp).ref.doc();
    console.log(myTest.id)

    const file = this.selectedFile
    const filePath = `${myTest.id}/name1`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    this.uploadPercent = task.percentageChanges();  

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().toPromise().then( (url) => {
          this.downloadURL = url;
          
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
