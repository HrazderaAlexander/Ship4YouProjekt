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

  /**
   * Save the current boat
   */
  @Input() boat: BoatDTO;

  /**
   * Save ratingId
   */
  ratingId:string="";

  /**
   * Save all boat images
   */
  imageObject: Array<object> = [];

  /**
   * 
   * @param afs -> Angular firestore
   */
  constructor(public afs: AngularFirestore) {

    /**
     * Set the rating
     * 
     * Get from localstorages
     */
    this.ratingId = localStorage.getItem('boatForShowPicturesBrand')+localStorage.getItem('boatForShowPicturesName');
  }

  /**
   * Willö be called at first
   */
  ngOnInit() {
    /**
     * Save data to object
     */
    this.imageObject = [{
      image: this.boat.imageUrl,
      thumbImage: this.boat.imageUrl,
      alt: this.boat.titlePictureDescription,
      title: this.boat.titlePictureDescription
    }]
    /**
     * Check if pcitures Url is not undefined
     */
    if(this.boat.picturesUrl != undefined){

      /**
       * Go through pictures url array
       */
      for(let i = 0; i< this.boat.picturesUrl.length; i++)
      {
        /**
         * Set picture
         */
        let img = {
          image: this.boat.picturesUrl[i],
          thumbImage: this.boat.picturesUrl[i],
          alt: this.boat.pictureDescriptionArray[i],
          title: this.boat.pictureDescriptionArray[i],
        }
        /**
         * Push image to objects array
         */
        this.imageObject.push(img);
      }
    }
  }
}
