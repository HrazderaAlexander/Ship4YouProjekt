import { AuthService } from 'src/app/shared/services/auth.service';
import { Component, OnInit  } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FirebaseService } from '../../app/shared/services/firebase.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { BoatDTO } from '../components/boats/boat';
import { BoatService } from '../components/boats/boat.service';

@Component({
  selector: 'app-multiple-pictures',
  templateUrl: './multiple-pictures.component.html',
  styleUrls: ['./multiple-pictures.component.css']
})
export class MultiplePicturesComponent implements OnInit {

  /**
   * Save the percent of uploading
   */
  uploadPercent: Observable<number>;

  /**
   * Variable to save all download Urls
   */
  downloadURL: Observable<string>[] = [];

  /**
   * Save selected file
   */
  selectedFile: FileList | null;

  /**
   * Save form
   */
  forma: FormGroup;

  /**
   * Save all 
   */
  tests: Observable<any[]>;

  /**
   * Variable to save boat
   */
  newBoat: BoatDTO = new BoatDTO();

  /**
   * Save description
   */
  description: string;

  /**
   * Variable to save picture Description in array
   */
  pictureDescriptionArray: string[] = [];

  /**
   * 
   * @param fb 
   * @param boatService 
   * @param router 
   * @param authService 
   * @param storage 
   * @param afs 
   * @param fs 
   */
  constructor(fb: FormBuilder, private boatService: BoatService, private router: Router, public authService: AuthService, private storage: AngularFireStorage, private afs: AngularFirestore, private fs: FirebaseService ) {
    
    /**
     * Set form data
     */
    this.forma = fb.group ({
      categoria: ['myCategoria'],

    })
  }

  /**
   * Will be called at first
   */
  ngOnInit() {
    /**
     * Set boat
     */
    this.newBoat = JSON.parse(localStorage.getItem('tmpBoat'));
    
    /**
     * Call methode()
     */
    this.mostrarImagenes();
  }

  /**
   * Save boat data
   */
  save() {

    /**
     * Set imageUrl from localstorage
     */
    this.newBoat.imageUrl = localStorage.getItem('downloadUrl');
    
    /**
     * Set documentUrl from localStorage
     */
    this.newBoat.documentUrl = localStorage.getItem('downloadDocumentUrl');
    
    /**
     * Remove from localstorage
     */
    localStorage.removeItem("downloadMultiPictures");
    localStorage.removeItem("downloadDocumentUrl");
    localStorage.removeItem('downloadUrl');
    
    /**
     * Set userId from localstorage
     */
    this.newBoat.userId = localStorage.getItem('userUid');
    
    /**
     * Set all boat ratings to 0
     */
    this.newBoat.allReatings = [0];

    /**
     * Set boat picturesUrl
     */
    this.newBoat.picturesUrl = this.downloadURL;

    /**
     * Check if picturesDescriptionArray are not null
     */
    if (this.pictureDescriptionArray != null){

      /**
       * Set picturesDescriptionArray from boat
       */
      this.newBoat.pictureDescriptionArray = this.pictureDescriptionArray;
    }

    /**
     * Check if localstorage is not null
     */
    if (localStorage.getItem("titlePictureDescription") != null){

      /**
       * Set title description from boat
       */
      this.newBoat.titlePictureDescription = localStorage.getItem("titlePictureDescription");
    }
    /**
     * Set rating to 0
     */
    this.newBoat.rating = 0;

    /**
     * Call boatService create methode
     */
    this.boatService.createBoat(this.newBoat);

    /**
     * clear newBoat variable
     */
    this.newBoat = new BoatDTO();

    /**
     * Clear downloadUrl array
     */
    this.downloadURL = [];
  }

  /**
   * Methode will be called if user submit
   */
  onSubmit() {

    /**
     * Check if description is not null
     */
    if (this.description != null){

      /**
       * Push description to array
       * 
       */
      this.pictureDescriptionArray.push(this.description);
    }
    /**
     * Calls save methode
     */
    this.save();

    /**
     * Navigate to dashboard
     */
    this.router.navigateByUrl("/dashboard");
  }

  /**
   * Get the selected file
   * 
   * @param event -> file
   */
  detectFiles(event) {

    /**
     * Set the selected file
     */
    this.selectedFile = event.target.files[0];
  }

  /**
   * UplaodFile methode
   */
  uploadFile() {
    /**
     * Get data from doc
     */
    const myTest = this.afs.collection(localStorage.getItem("createBoatId")+"Mult").ref.doc();

    /**
     * Set file
     */
    const file = this.selectedFile

    /**
     * Set filePath
     */
    const filePath = `${myTest.id}/name1`;

    /**
     * Set fileRef
     */
    const fileRef = this.storage.ref(filePath);

    /**
     * Set task
     */
    const task = this.storage.upload(filePath, file);

    /**
     * Set percent
     */
    this.uploadPercent = task.percentageChanges();

    /**
     * Uploade picture
     */
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().toPromise().then( (url) => {
          /**
           * Push to url
           */
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

  /**
   * Get all boat pictures from db
   */
  mostrarImagenes() {
    this.tests = this.fs.getTests();
  }
}
