import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { BoatDTO } from './boat';

@Injectable({
  providedIn: 'root'
})
export class BoatService {

  public dbPath = '/customers';

  public tmpBoat: BoatDTO = new BoatDTO();

  boatsRef: AngularFireList<BoatDTO> = null;


  constructor(public db: AngularFireDatabase) {
    this.boatsRef = db.list(this.dbPath);
  }

  createBoat(boat: BoatDTO): void {
    //this.customersRef = this.db.list(this.dbPath)
    //customer.key = customer.name;
    this.boatsRef.push(boat);
  }

  updateBoat(key: string, value: any): Promise<void> {
    return this.boatsRef.update(key, value);
  }

  deleteBoat(key: string): Promise<void> {
    return this.boatsRef.remove(key);
  }

  getBoatsList(): AngularFireList<BoatDTO> {
    return this.boatsRef;
  }

  deleteAll(): Promise<void> {
    return this.boatsRef.remove();
  }
}
