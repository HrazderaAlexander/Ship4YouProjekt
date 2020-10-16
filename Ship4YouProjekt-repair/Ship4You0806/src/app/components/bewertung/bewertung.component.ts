import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Customer } from '../customers/customer';
import { CustomerService } from '../customers/customer.service';

@Component({
  selector: 'app-bewertung',
  templateUrl: './bewertung.component.html',
  styleUrls: ['./bewertung.component.css']
})
export class BewertungComponent implements OnInit {




  customers: any = [];
  boat: any = new Customer;
  id:string = localStorage.getItem('boatForRating');
  feedback:string="";
  isChosen:boolean = false;

  constructor(private customerService: CustomerService, public authService: AuthService) { }

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
    
    for(let i = 0; i < this.customers.length;i++){
      if(this.id == this.customers[i].key){
        this.boat = this.customers[i];
        console.log("Single boat: "+this.boat.vintage+" " +this.boat.masts + " "+ this.boat.sail+ " " + this.boat.brand);
      }
    }
    return this.boat;
  }

  addFeedback(){

  }

  choosePhoto(){

  }

}
