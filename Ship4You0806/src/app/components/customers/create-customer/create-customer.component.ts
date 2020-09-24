import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Picture } from 'src/app/Picture';

import { Customer } from '../customer';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss']
})
export class CreateCustomerComponent implements OnInit {

  customer: Customer = new Customer();
  submitted = false;

  constructor(private customerService: CustomerService, private router: Router) { }

  ngOnInit() {
  }

  newCustomer(): void {
    this.submitted = false;
    this.customer = new Customer();
  }

  save() {
    //this.customer.imageUrl = "https://firebasestorage.googleapis.com/v0/b/ship4you-36b43.appspot.com/o/1600897207082_Retana24.jpeg?alt=media&token=bc63b384-7b18-437e-bd86-9b4e13dd05ae";
    this.customer.imageUrl = localStorage.getItem('downloadUrl');
    this.customerService.createCustomer(this.customer);
    this.customer = new Customer();
  }

  isHovering: boolean;

  files: File[] = [];

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      //Picture.saveFilePath = this.boatBrand + this.boatName;
      this.files.push(files.item(i));
    }
  }

  onSubmit() {
    this.submitted = true;
    this.save();
    this.router.navigateByUrl("/dashboard");
  }

}
