import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CustomerService } from '../customer.service';
import { Customer } from '../customer';
import { NavigationEnd, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {

  @Input() customer: Customer;

  constructor(private customerService: CustomerService, private router: Router, private afs: AngularFirestore) {  }

  ngOnInit() {
  }

  updateActive(isActive: boolean) {
    this.customerService
      .updateCustomer(this.customer.key, { active: isActive })
      .catch(err => console.log(err));
  }

  deleteCustomer() {
    this.customerService
      .deleteCustomer(this.customer.key)
      .catch(err => console.log(err));
  }
  clickRating(brand, name){
    localStorage.setItem('boatForRating', this.customer.key);
    localStorage.setItem('boatForRatingName', name);
    localStorage.setItem('boatForRatingBrand', brand);
    this.router.navigateByUrl('/bewertung');
  }

}
