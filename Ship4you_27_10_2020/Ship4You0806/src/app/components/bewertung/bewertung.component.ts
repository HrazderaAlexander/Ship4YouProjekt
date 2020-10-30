import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Customer } from '../customers/customer';
import { CustomerService } from '../customers/customer.service';
import { Rating } from './rating';
import { DatePipe } from '@angular/common';
import { MaxLengthValidator } from '@angular/forms';

@Component({
  selector: 'app-bewertung',
  templateUrl: './bewertung.component.html',
  styleUrls: ['./bewertung.component.css']
})
export class BewertungComponent implements OnInit {
  currentRate = 6;
  mydate:string="";
  customers: any = [];
  boat: any = new Customer;
  id:string = localStorage.getItem('boatForRating');
  feedback:string="";
  isChosen:boolean = false;
  newRating:Rating = new Rating();

  constructor(private customerService: CustomerService, public authService: AuthService, private datePipe:DatePipe) { 
    this.mydate = this.datePipe.transform(Date.now(), 'dd.MM.yyyy');
  }

  ngOnInit() {
    this.getCustomersList();
  }

  getCustomersList() {
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

  getSingleBoat(): any{               //SingleCustomer
    
    var c = localStorage.getItem('numberOfBoats');
    if(!isNaN(Number(c))){
      var counter = Number(c);
      for(let i = 0; i < counter;i++){
        if(this.id == this.customers[i].key){
          this.boat = this.customers[i];
        }
      }
      return this.boat;  
    }
    else{
      console.log("Not a number!");
      return null;
    }
  }

  addFeedback(){
    const user = JSON.parse(localStorage.getItem('user'));
    this.newRating.username = user.displayName;
    this.newRating.date = this.mydate;
    this.newRating.ratingStars = this.currentRate;
    this.newRating.text = this.feedback;

    this.customersRef.push(customer);

  }

  choosePhoto(){

  }

}
