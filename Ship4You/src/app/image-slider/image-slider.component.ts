import { createOfflineCompileUrlResolver } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { BoatDTO } from '../components/boats/boat';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css']
})
export class ImageSliderComponent implements OnInit {

  @Input() boat: BoatDTO;
  ratingId:string="";
  boatImageDb:any[] = [];
  boatImageRef: AngularFirestoreDocument<any>[] = [];

  imageObject: Array<object> = [];

  constructor(public afs: AngularFirestore) {
    this.ratingId = localStorage.getItem('boatForShowPicturesBrand')+localStorage.getItem('boatForShowPicturesName');
   }

  ngOnInit() {
    //this.ratingId = localStorage.getItem('boatForShowPicturesBrand')+localStorage.getItem('boatForShowPicturesName');
    //this.afs.collection(localStorage.getItem('boatForShowPicturesBrand')+localStorage.getItem('boatForShowPicturesName')).valueChanges().subscribe(v => this.ratingId = `${v.length}`);
    this.imageObject = [{
      image: this.boat.imageUrl,
      thumbImage: this.boat.imageUrl,
      alt: 'alt of image',
      title: 'title of image'
    }]
    if(this.boat.picturesUrl != undefined){
      for(let i = 0; i< this.boat.picturesUrl.length; i++)
      {
        let img = {
          image: this.boat.picturesUrl[i],
          thumbImage: this.boat.picturesUrl[i],
          alt: 'alt of image',
          title: 'title of image'
        }
        this.imageObject.push(img);
      }
    }
  }
}
