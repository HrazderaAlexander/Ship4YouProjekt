import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { BoatDTO } from './boat';

@Injectable({
  providedIn: 'root'
})
export class BoatService {

  public dbPath = '/customers';

  public tmpBoat: BoatDTO = new BoatDTO();

  customersRef: AngularFireList<BoatDTO> = null;


  constructor(public db: AngularFireDatabase) {
    this.customersRef = db.list(this.dbPath);
  }

  createCustomer(boat: BoatDTO): void {
    //this.customersRef = this.db.list(this.dbPath)
    //customer.key = customer.name;
    this.customersRef.push(boat);
  }

  updateCustomer(key: string, value: any): Promise<void> {
    return this.customersRef.update(key, value);
  }

  deleteCustomer(key: string): Promise<void> {
    return this.customersRef.remove(key);
  }

  getCustomersList(): AngularFireList<BoatDTO> {
    return this.customersRef;
  }

  deleteAll(): Promise<void> {
    return this.customersRef.remove();
  }
}
