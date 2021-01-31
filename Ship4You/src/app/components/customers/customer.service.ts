import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Customer } from './customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  public dbPath = '/customers';

  public tmpBoat: Customer = new Customer();

  customersRef: AngularFireList<Customer> = null;


  constructor(public db: AngularFireDatabase) {
    this.customersRef = db.list(this.dbPath);
  }

  createCustomer(customer: Customer): void {
    //this.customersRef = this.db.list(this.dbPath)
    //customer.key = customer.name;
    this.customersRef.push(customer);
  }

  updateCustomer(key: string, value: any): Promise<void> {
    return this.customersRef.update(key, value);
  }

  deleteCustomer(key: string): Promise<void> {
    return this.customersRef.remove(key);
  }

  getCustomersList(): AngularFireList<Customer> {
    return this.customersRef;
  }

  deleteAll(): Promise<void> {
    return this.customersRef.remove();
  }
}
