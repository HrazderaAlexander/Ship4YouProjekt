import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  /**
   * Url string
   */
  url: string = 'http://localhost:3000/send';

  /**
   * 
   * @param http -> Use Http
   */
  constructor(private http: HttpClient) { }

  /**
   * Is used for contact us
   * 
   * @param messageContent -> text from message
   */
  sendMessage(messageContent: any) {
    /**
     * Http-Post
     */
    return this.http.post(this.url,
    JSON.stringify(messageContent),
    { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), responseType: 'text' });
  }
}
