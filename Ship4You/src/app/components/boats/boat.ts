import { Observable } from 'rxjs';

/**
 * Class with all boat datas
 */
export class BoatDTO {
  key: string;
  name: string;
  age: number;
  active = true;
  imageUrl: string;
  documentUrl?: string;
  picturesUrl: Observable<string>[];
  vintage:number; //Baujahr
  type:string;
  brand:string; //Marke
  location:string;
  lessor:string; //Vermieter
  cabins:number;
  length:number;
  sail:number;
  numberOfPeople:number; //Anzahl der Personen am Boot
  masts:number;
  rating:number;
  favourite:boolean;
  userId:string;
  allReatings:number[];
  port: string;
  pictureDescriptionArray?: string[];
  linkToRentSide: string;
  creatorEmail: string;
  titlePictureDescription: string;
}
