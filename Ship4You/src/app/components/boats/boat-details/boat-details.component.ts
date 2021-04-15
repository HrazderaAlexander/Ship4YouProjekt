import { Component, OnInit, Input, OnDestroy, Inject } from '@angular/core';
import { BoatService } from '../boat.service';
import { BoatDTO } from '../boat';
import { NavigationEnd, Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { DOCUMENT } from '@angular/common';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { SignInComponent } from '../../sign-in/sign-in.component';
import { map } from 'rxjs/internal/operators/map';
import * as $ from 'jquery';
import { Rating } from '../../bewertung/rating';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { EditBoatComponent } from 'src/app/edit-boat/edit-boat.component';

@Component({
  selector: 'app-boat-details',
  templateUrl: './boat-details.component.html',
  styleUrls: ['./boat-details.component.css']
})
export class BoatDetailsComponent implements OnInit {
  userId:string = "";
  isEdit:boolean = false;
  @Input() boat: BoatDTO;
  @Input() showButtons:string;
  favButtonPressed:boolean;
  favRef: AngularFirestoreDocument<any>;
  currentRate = 0;
  userIds : string[] = JSON.parse(localStorage.getItem('userIds'));
  feedbackLength = 0;

  dbPath = '/customers';
  boatsRef: AngularFireList<BoatDTO> = null;

  //defaultElevation
  defaultElevation = 2;

  constructor(public dialog: MatDialog, public authService: AuthService, private boatService: BoatService, public db: AngularFireDatabase, private router: Router, private afs: AngularFirestore)
  {
    this.boatsRef = db.list(this.dbPath);
  }

  ngOnInit() {

    console.log("INIIIIIIIIIIIIIIIIIIIIIT")
    this.getCustomersList();
    for(let i =0; i < parseInt(localStorage.getItem('numberOfBoats')); i++)
    {
      this.favRef = this.afs.doc(`${localStorage.getItem('userUid')}/${this.boat.brand + this.boat.name}`);
      this.favRef.valueChanges().subscribe(item => {
        if(item != null)
          this.favButtonPressed = item.favourite
      });
    }
    this.userId = localStorage.getItem('userUid');
    this.afs.collection(`${this.boat.brand + this.boat.name}`).valueChanges().subscribe(s => this.feedbackLength = s.length);

  }

  boats: any = [];
  getBoatsFeedbackList() {
    this.boatService.getBoatsList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(boats => {
      this.boats = boats;
      this.getSingleBoat();
    });
  }

  getCustomersList() {
    this.boatService.getBoatsList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(customers => {

      this.boats = customers.sort((n1, n2)=>
      {
        if (n1.rating < n2.rating) {
          return 1;
        }

        if (n1.rating > n2.rating) {
          return -1;
        }

        return 0;
      });
      localStorage.setItem('numberOfBoats', this.boats.length);
      localStorage.setItem('customerArray', JSON.stringify(this.boats));
    });
  }

  boatNew: any = new BoatDTO;
  id:string = localStorage.getItem('boatForRating');
  ratingBoat: number[];
  boatKey: string="";
  getSingleBoat(): any{               //SingleCustomer

    var c = localStorage.getItem('numberOfBoats');
    if(!isNaN(Number(c))){
      var counter = Number(c);
      for(let i = 0; i < counter;i++){
        if(this.id == this.boats[i].key){
          this.boatNew = this.boats[i];
          console.log("BoatWithRating " + this.boatNew.allReatings);
          this.ratingBoat = this.boatNew.allReatings;
          this.boatKey = this.boatNew.key;
          console.log("BoatKey " + this.boatKey);
        }
      }
      return this.boatNew;
    }
    else{
      console.log("Not a number!");
      return null;
    }
  }

  openImageSlider(){
    this.router.navigateByUrl("/image-slider");
  }

  confirmDialog(): void {
    const message = `Do you wanna login now?`;

    const dialogData = new ConfirmDialogModel("Not logged in!", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult){
        this.confirmSignIn();
      }
    });
  }

  updateActive(isActive: boolean) {
    this.boatService
      .updateBoat(this.boat.key, { active: isActive })
      .catch(err => console.log(err));
  }

  confirmSignIn(): void{
    const dialogRef = this.dialog.open(SignInComponent, {
      maxWidth: "400px",
    });
  }

  changeEditButton(){
    if(this.isEdit)
      this.isEdit = false;
    else
      this.isEdit = true;
  }

  confirmEditBoatDialog(): void {
    const dialogRef = this.dialog.open(EditBoatComponent, {
      maxWidth: "900px"
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(!dialogResult){
       //this.getFeedbackData();
      }
      //this.showNoResult = false;
    });
  }

  boatDTO : BoatDTO = null;
  editPhotoBoat(boatId: string, boatKey: string){
     this.boatsRef.valueChanges().subscribe(test => {
      test.forEach(item => {
       
        if ((item.brand + item.name) == boatId){
          item.key = boatKey; 
          this.boatDTO = item;
          
          setTimeout(() => {localStorage.setItem('BoatToEdit', JSON.stringify(item));}, 5)
        }
      })
    });

    setTimeout(() => {this.confirmEditBoatDialog();}, 50)
  }

  saveUpdateList(cus:BoatDTO) {
    if(this.boat.userId == localStorage.getItem('userUid')){
        this.boatService
        .updateBoat(cus.key, cus)
        .catch(err => console.log(err));
    }
    this.refreshPage();
  }

  refreshPage() {
    window.location.reload();
  }

  cancelEdit(){
    this.isEdit = false;
    this.refreshPage();
  }

  async deleteCustomer() {
    const length = this.feedbackLength;
    if(this.boat.userId == localStorage.getItem('userUid'))
    {
      if(confirm("Are you sure to delete "+this.boat.name + "?"))
      {
        for(let i = 0; i < this.userIds.length; i++){
          await this.afs.collection(this.userIds[i]).doc(`${this.boat.brand + this.boat.name}`).delete();
        }
        for(let i = 0; i < length; i++){
          await this.afs.doc(`${this.boat.brand + this.boat.name}/${i}`).delete();
        }
        this.boatService
        .deleteBoat(this.boat.key)
        .catch(err => console.log(err));
      }
    }
  }
  clickRating(brand, name){
    if(this.authService.isLoggedIn){
      localStorage.setItem('boatForRating', this.boat.key);
      localStorage.setItem('boatForRatingName', name);
      localStorage.setItem('boatForRatingBrand', brand);
      this.getBoatsFeedbackList();
      this.router.navigateByUrl('/bewertung');
    }
    else
      this.confirmDialog();
  }

  clickFavButton(c:BoatDTO, fav:boolean){
    if(!this.authService.isLoggedIn){
      this.confirmDialog();
    }
    else{
      const favRef: AngularFirestoreDocument<any> = this.afs.doc(`${localStorage.getItem('userUid')}/${c.brand + c.name}`);
      const favouriteData: any = {
        favourite: fav,
        boatId: c.key,
        userId: localStorage.getItem('userUid')
      };

      this.favButtonPressed = fav;

      favRef.set(favouriteData, {
        merge:true
      });
    }
  }

  url;
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
         this.url= (event.target as FileReader).result;  //event.target.result.toString();
         this.boat.imageUrl = this.url;
         console.log('Boat.imageUrl: ', this.boat.imageUrl);
         console.log('KEY: ', this.boat.key);
         this.boatService.updateBoat(this.boat.key, this.boat);

      }


    }
  }

}
