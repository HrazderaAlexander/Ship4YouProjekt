import { createOfflineCompileUrlResolver } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Customer } from '../components/customers/customer';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css']
})
export class ImageSliderComponent implements OnInit {

  @Input() customer: Customer;
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
      image: this.customer.imageUrl,
      thumbImage: this.customer.imageUrl,
      alt: 'alt of image',
      title: 'title of image'
    }]
    if(this.customer.picturesUrl != undefined){
      for(let i = 0; i< this.customer.picturesUrl.length; i++)
      {
        let img = {
          image: this.customer.picturesUrl[i],
          thumbImage: this.customer.picturesUrl[i],
          alt: 'alt of image',
          title: 'title of image'
        }
        this.imageObject.push(img);
      }
    }
  }
}
