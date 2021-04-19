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

   openPopup(){
     console.log("test");
     alert("Test")
   }

  ngOnInit() {
    this.imageObject = [{
      image: this.boat.imageUrl,
      thumbImage: this.boat.imageUrl,
      alt: this.boat.titlePictureDescription,
      title: this.boat.titlePictureDescription
    }]
    if(this.boat.picturesUrl != undefined){
      for(let i = 0; i< this.boat.picturesUrl.length; i++)
      {
        let img = {
          image: this.boat.picturesUrl[i],
          thumbImage: this.boat.picturesUrl[i],
          alt: this.boat.pictureDescriptionArray[i],
          title: this.boat.pictureDescriptionArray[i],
        }
        this.imageObject.push(img);
      }
    }
  }
}
