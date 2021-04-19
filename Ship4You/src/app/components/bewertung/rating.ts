import { Observable } from "rxjs";

/**
 * Class to save rating details
 */
export class Rating{
    idRating:string;
    username:string;
    text:string;
    date:string;
    ratingStars:number;
    picturesId:Observable<String>[];
    userImage:string;
    userId:string;
}
