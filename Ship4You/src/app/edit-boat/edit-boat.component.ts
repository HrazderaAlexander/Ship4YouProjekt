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

  /**
   * Save the upload percent
   */
  uploadPercent: Observable<number>;

  /**
   * Save the download urls of all pictures
   */
  downloadURL: Observable<string>[] = [];

  /**
   * Variable to save the selected file
   */
  selectedFile: FileList | null;

  /**
   * Variable to save the form stats
   */
  forma: FormGroup;

  /**
   * Save all pictures
   */
  tests: Observable<any[]>;

  /**
   * save the current boat
   */
  newBoat: BoatDTO = new BoatDTO();
  
  /**
   * Description of the picture
   */
  description: string;

  /**
   * All descriptions of the pictures
   */
  pictureDescriptionArray: string[] = [];

  /**
   * 
   * @param fb 
   * @param boatService 
   * @param dialogRef 
   * @param router 
   * @param authService 
   * @param storage 
   * @param afs 
   * @param fs 
   */
  constructor(fb: FormBuilder, private boatService: BoatService, public dialogRef: MatDialogRef<EditBoatComponent>, @Inject(MAT_DIALOG_DATA) private router: Router, public authService: AuthService, private storage: AngularFireStorage, private afs: AngularFirestore, private fs: FirebaseService ) {
    
    /**
     * Set form
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
     * Get the new boat from localstorage
     * 
     * Save it to variable
     */
    this.newBoat = JSON.parse(localStorage.getItem('BoatToEdit'));
    
    /**
     * Call image methode
     */
    this.mostrarImagenes();
  }

  /**
   * 
   */
  save() {

    /**
     * Start the loading circle
     */
    this.startLoading();
    
    /**
     * Call updateBoat methode in service
     */
    this.boatService.updateBoat(this.newBoat.key, this.newBoat);
    
    /**
     * reload location
     */
    location.reload();
  }

  /**
   * Methode will be called at submit
   * 
   * Save data
   */
  onSubmit() {
    /**
     * Check if description is not null
     */
    if (this.description != null){

      /**
       * Push current decription to array
       */
      this.pictureDescriptionArray.push(this.description);
    }
    /**
     * Call methode save()0
     */
    this.save();

    /**
     * Navigate to dashboard
     */
    this.router.navigateByUrl("/dashboard");
  }

  /**
   * Get the detected file
   * 
   * @param event -> detected file
   */
  detectFiles(event) {
    /**
     * Set the detected file
     */
    this.selectedFile = event.target.files[0];
    
    /**
     * Call uploadFile() methode
     */
    this.uploadFile();
  }

  /**
   * Will be called if user clicked in dialog on confirm
   */
  onConfirm(): void {
    /**
     * Close dialog
     */
    this.dialogRef.close(false);
  }

  /**
   * Will be called if user cancel dialog
   */
  onDismiss(): void {
    /**
     * Close dialog
     */
    this.dialogRef.close(false);
  }

  /**
   * Upload file methode
   */
  uploadFile() {

    /**
     * Get the path to the doc
     */
    const myTest = this.afs.collection(localStorage.getItem("createBoatId")+"Mult").ref.doc();

    /**
     * Set selected file
     */
    const file = this.selectedFile

    /**
     * Set file path
     */
    const filePath = `${myTest.id}/name1`;
    
    /**
     * Set storage ref (filePath)
     */
    const fileRef = this.storage.ref(filePath);
    
    /**
     * Set upload task
     */
    const task = this.storage.upload(filePath, file);

    /**
     * Set the current percent
     */
    this.uploadPercent = task.percentageChanges();

    /**
     * Save boat to db
     */
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().toPromise().then( (url) => {
          
          /**
           * Add picture url to boat
           */
          this.newBoat.picturesUrl.push(url);
          
          /**
           * Set data
           */
          myTest.set({
            categoria: this.forma.value.categoria,
            imagenes : this.downloadURL,
            myId : myTest.id
          })
        }).catch(err=> { console.log(err) });
      })
    )
    .subscribe()
  }

  /**
   * 
   */
  mostrarImagenes() {
    /**
     * Set pictures
     */
    this.tests = this.fs.getTests();
  }

  /**
   * 
   * @param image -> current image
   */
  deleteImage(image:Observable<string>){

    /**
     * Search for img in array
     */
    this.newBoat.picturesUrl.forEach(img => {
      
      /**
       * Check if images are equal
       */
      if(img == image){
        /**
         * Delete image
         */
        this.newBoat.picturesUrl.splice(this.newBoat.picturesUrl.indexOf(image),1);
      }
    })
  }

  /**
   * Color of the loading circle
   */
  color: ThemePalette = 'primary';

  /**
   * Mode of the circle
   */
  mode: ProgressSpinnerMode = 'indeterminate';
  
  /**
   * State of the circle
   * 
   * Is it enabled ?
   */
  check = false;
  
  /**
   * Methode to start circle
   */
  startLoading(){
    /**
     * Set check to true
     */
    this.check=true;
  }
}
