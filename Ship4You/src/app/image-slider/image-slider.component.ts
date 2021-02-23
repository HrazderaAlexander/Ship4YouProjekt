import { createOfflineCompileUrlResolver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css']
})
export class ImageSliderComponent implements OnInit {

  ratingId:string="";
  boatImageDb:any[] = [];
  boatImageRef: AngularFirestoreDocument<any>[] = [];

  imageObject: Array<object> = [{
    image: localStorage.getItem("titlePictureUrl"),
    thumbImage: localStorage.getItem("titlePictureUrl"),
    alt: 'alt of image',
    title: 'title of image'
  }, {
    image: 'https://i.picsum.photos/id/838/1020/600.jpg',
    thumbImage: 'https://i.picsum.photos/id/838/400/350.jpg',
    title: 'Image title',
    alt: 'Image alt'
  }, {
    image: 'https://i.picsum.photos/id/93/1020/600.jpg',
    thumbImage: 'https://i.picsum.photos/id/93/400/350.jpg',
    title: 'Image2 title',
    alt: 'image2 alt'
  }, {
    image: 'https://i.picsum.photos/id/543/1020/600.jpg',
    thumbImage: 'https://i.picsum.photos/id/543/400/350.jpg',
    title: 'Image title',
    alt: 'Image alt'
  }, {
    image: 'https://i.picsum.photos/id/613/1020/600.jpg',
    thumbImage: 'https://i.picsum.photos/id/613/400/350.jpg',
    title: 'Image title',
    alt: 'Image alt'
  }, {
    image: 'https://i.picsum.photos/id/609/1020/600.jpg',
    thumbImage: 'https://i.picsum.photos/id/609/400/350.jpg',
    title: 'Image title',
    alt: 'Image alt'
  }, {
    image: 'https://i.picsum.photos/id/717/1020/600.jpg',
    thumbImage: 'https://i.picsum.photos/id/717/400/350.jpg',
    title: 'Image title',
    alt: 'Image alt'
  }
  ];

  constructor(public afs: AngularFirestore) {
    this.ratingId = localStorage.getItem('boatForShowPicturesBrand')+localStorage.getItem('boatForShowPicturesName');
   }

  ngOnInit() {
    //this.ratingId = localStorage.getItem('boatForShowPicturesBrand')+localStorage.getItem('boatForShowPicturesName');
    //this.afs.collection(localStorage.getItem('boatForShowPicturesBrand')+localStorage.getItem('boatForShowPicturesName')).valueChanges().subscribe(v => this.ratingId = `${v.length}`);
    this.getImageData();
    this.imageObject;
  }

  getImageData(){
    console.log("In Image Data")
    for(let i =0; i < 3; i++){
      this.boatImageRef[i] = this.afs.doc(`${localStorage.getItem('boatForShowPicturesBrand') + localStorage.getItem('boatForShowPicturesName')}/${i}`);
      this.boatImageRef[i].valueChanges().subscribe(item =>
      {
        this.boatImageDb[i] = item
      });

      this.imageObject.push({
        image: this.boatImageDb[i].picturesId,
        thumbImage: this.boatImageDb[i].picturesId,
        title: 'Image titlenew',
        alt: 'Image altnew'
      })
      console.log("Image url " + this.boatImageDb[i].picturesId);

    }
  }

}
