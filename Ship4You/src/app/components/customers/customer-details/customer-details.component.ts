import { Component, OnInit, Input, OnDestroy, Inject } from '@angular/core';
import { CustomerService } from '../customer.service';
import { Customer } from '../customer';
import { NavigationEnd, Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { DOCUMENT } from '@angular/common';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { SignInComponent } from '../../sign-in/sign-in.component';
import { map } from 'rxjs/internal/operators/map';
import * as $ from 'jquery';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {
  userId:string = "";
  isEdit:boolean = false;
  @Input() customer: Customer;
  @Input() showButtons:string;
  favButtonPressed:boolean;
  favRef: AngularFirestoreDocument<any>;
  currentRate = 0;
  userIds : string[] = JSON.parse(localStorage.getItem('userIds'));
  feedbackLength = 0;

  //defaultElevation
  defaultElevation = 2;

  constructor(public dialog: MatDialog, public authService: AuthService, private customerService: CustomerService, private router: Router, private afs: AngularFirestore)
  {
  }

  ngOnInit() {
    for(let i =0; i < parseInt(localStorage.getItem('numberOfBoats')); i++)
    {
      this.favRef = this.afs.doc(`${localStorage.getItem('userUid')}/${this.customer.brand + this.customer.name}`);
      this.favRef.valueChanges().subscribe(item => {
        if(item != null)
          this.favButtonPressed = item.favourite
      });
    }
    this.userId = localStorage.getItem('userUid');
    this.afs.collection(`${this.customer.brand + this.customer.name}`).valueChanges().subscribe(s => this.feedbackLength = s.length);

  }

  customers: any = [];
  getCustomersFeedbackList() {
    this.customerService.getCustomersList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(customers => {
      this.customers = customers;
      this.getSingleBoat();
    });
  }

  boat: any = new Customer;
  id:string = localStorage.getItem('boatForRating');
  ratingBoat: number[];
  boatKey: string="";
  getSingleBoat(): any{               //SingleCustomer

    var c = localStorage.getItem('numberOfBoats');
    if(!isNaN(Number(c))){
      var counter = Number(c);
      for(let i = 0; i < counter;i++){
        if(this.id == this.customers[i].key){
          this.boat = this.customers[i];
          console.log("BoatWithRating " + this.boat.allReatings);
          this.ratingBoat = this.boat.allReatings;
          this.boatKey = this.boat.key;
          console.log("BoatKey " + this.boatKey);
        }
      }
      return this.boat;
    }
    else{
      console.log("Not a number!");
      return null;
    }
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
    this.customerService
      .updateCustomer(this.customer.key, { active: isActive })
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

  saveUpdateList(cus:Customer) {
    if(this.customer.userId == localStorage.getItem('userUid')){
        this.customerService
        .updateCustomer(cus.key, cus)
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
    if(this.customer.userId == localStorage.getItem('userUid'))
    {
      if(confirm("Are you sure to delete "+this.customer.name + "?"))
      {
        for(let i = 0; i < this.userIds.length; i++){
          await this.afs.collection(this.userIds[i]).doc(`${this.customer.brand + this.customer.name}`).delete();
        }
        for(let i = 0; i < length; i++){
          await this.afs.doc(`${this.customer.brand + this.customer.name}/${i}`).delete();
        }
        this.customerService
        .deleteCustomer(this.customer.key)
        .catch(err => console.log(err));
      }
    }
  }
  clickRating(brand, name){
    if(this.authService.isLoggedIn){
      localStorage.setItem('boatForRating', this.customer.key);
      localStorage.setItem('boatForRatingName', name);
      localStorage.setItem('boatForRatingBrand', brand);
      this.getCustomersFeedbackList();
      this.router.navigateByUrl('/bewertung');
    }
    else
      this.confirmDialog();
  }

  clickFavButton(c:Customer, fav:boolean){
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
         this.customer.imageUrl = this.url;
         console.log('Customer.imageUrl: ', this.customer.imageUrl);
         console.log('KEY: ', this.customer.key);
         this.customerService.updateCustomer(this.customer.key, this.customer);

      }


    }
  }

}
