import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Picture } from '../../../Picture';
import { BoatData } from 'src/app/BoatData';
import { pictureArrayInterface } from '../pictureArrayInterface';

@Component({
  selector: 'app-upload-task-multiple-pictures',
  templateUrl: './upload-task-multiple-pictures.component.html',
  styleUrls: ['./upload-task-multiple-pictures.component.css']
})
export class UploadTaskMultiplePicturesComponent implements OnInit { //UploadTaskMultiplePicturesComponent

  @Input() file: File;
  task: AngularFireUploadTask;

  @Input() savePath: Picture;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  picturesArray: string[];

  constructor(private storage: AngularFireStorage, private db: AngularFirestore) {
    if ((JSON.parse(localStorage.getItem("downloadMultiPictures"))) == null){
      console.log("Is null");
      this.picturesArray = [];
    }
    else
    {
      console.log("is not null");
      this.picturesArray = JSON.parse(localStorage.getItem("downloadMultiPictures"));
    }
   }

  ngOnInit() {
    this.startUpload();
  }

  startUpload() {

    // The storage path
    const path = `${Picture.saveFilePath}/${Date.now()}_${this.file.name}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, this.file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    this.snapshot   = this.task.snapshotChanges().pipe(
      tap(console.log),
      // The file's download URL
      finalize( async() =>  {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        //Picture.saveDownloadUrl = this.downloadURL;
        //console.log("PictureURL: " + Picture.saveDownloadUrl);
        //localStorage.setItem('downloadMultPictures', this.downloadURL);
        console.log("is not null");

        if (localStorage.getItem("downloadMultiPictures").length == 0){
          this.picturesArray = [];
        }
        else{
          this.picturesArray = JSON.parse(localStorage.getItem("downloadMultiPictures"));
        }
        this.picturesArray.push(this.downloadURL);
        console.log("PicturesArrayStringify " + JSON.stringify(this.picturesArray));
        //this.picturesArray = ["Test", "Hi"];
        localStorage.setItem("downloadMultiPictures", JSON.stringify(this.picturesArray));
        this.db.collection('files').doc(Picture.saveFilePath).set( { downloadURL: this.downloadURL, path });
      }),
    );
  }

  isActive(snapshot) {
    
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }


}
