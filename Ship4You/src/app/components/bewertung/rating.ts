import { Observable } from "rxjs";

export class Rating{
    idRating:string;
    username:string;
    text:string;
    date:string;
    ratingStars:number;
    picturesId:Observable<String>[];
}
