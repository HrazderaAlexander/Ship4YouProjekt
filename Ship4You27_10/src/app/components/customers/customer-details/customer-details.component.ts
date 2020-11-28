import { Component, OnInit, Input, OnDestroy, Inject } from '@angular/core';
import { CustomerService } from '../customer.service';
import { Customer } from '../customer';
import { NavigationEnd, Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { DOCUMENT } from '@angular/common';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {
  userId:string = "";
  isEdit:boolean = false;
  @Input() customer: Customer;
  favButtonPressed:boolean;
  favRef: AngularFirestoreDocument<any>;

  constructor(public dialog: MatDialog, public authService: AuthService, private customerService: CustomerService, private router: Router, private afs: AngularFirestore) {  }

  ngOnInit() {
    for(let i =0; i < parseInt(localStorage.getItem('numberOfBoats')); i++)
    {
      this.favRef = this.afs.doc(`${localStorage.getItem('userUid')}/${this.customer.brand + this.customer.name}`);
      this.favRef.valueChanges().subscribe(item => this.favButtonPressed = item.favourite);  
    }
    this.userId = localStorage.getItem('userUid');
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
        this.router.navigateByUrl('sign-in');
      }
    });
  }

  updateActive(isActive: boolean) {
    this.customerService
      .updateCustomer(this.customer.key, { active: isActive })
      .catch(err => console.log(err));
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

  deleteCustomer() {
    if(this.customer.userId == localStorage.getItem('userUid'))
    {
      if(confirm("Are you sure to delete "+this.customer.name + "?")) {
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
        boatId: localStorage.getItem('boatForRating'),
        userId: localStorage.getItem('userUid')
      };
  
      this.favButtonPressed = fav;
  
      favRef.set(favouriteData, {
        merge:true
      });
    }
  }
}