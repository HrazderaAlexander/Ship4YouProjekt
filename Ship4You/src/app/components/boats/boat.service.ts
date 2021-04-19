import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { BoatDTO } from './boat';

@Injectable({
  providedIn: 'root'
})
export class BoatService {

  /**
   * Path of the boats
   */
  public dbPath = '/customers';

  /**
   * Save the boatData
   */
  public tmpBoat: BoatDTO = new BoatDTO();

  /**
   * Save all boats in list
   */
  boatsRef: AngularFireList<BoatDTO> = null;

  /**
   * 
   * @param db 
   */
  constructor(public db: AngularFireDatabase) {

    /**
     * Set all boats from db to list
     */
    this.boatsRef = db.list(this.dbPath);
  }

  /**
   * Save boat to db
   * 
   * @param boat -> current boat which should be saved in db
   */
  createBoat(boat: BoatDTO): void {
    this.boatsRef.push(boat);
  }

  /**
   * Update some data of the boat
   * 
   * @param key -> key of the boat
   * @param value -> boat self
   */
  updateBoat(key: string, value: any): Promise<void> {
    return this.boatsRef.update(key, value);
  }

  /**
   * Delete boat with the current key
   * 
   * @param key -> key of the boat
   */
  deleteBoat(key: string): Promise<void> {
    return this.boatsRef.remove(key);
  }

  /**
   * Gets a list of all boats from db
   * 
   * @returns -> a list of all boats
   */
  getBoatsList(): AngularFireList<BoatDTO> {
    return this.boatsRef;
  }

  /**
   * Delete all boats in db
   */
  deleteAll(): Promise<void> {
    return this.boatsRef.remove();
  }
}
