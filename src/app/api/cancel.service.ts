import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CancelService {

  constructor(
    public httpClient: HttpClient
  ) { }

  Cancel(payload: {room: {id_reserve, canceled_at}}) {
    return this.httpClient.post('http://192.168.1.9:8080/api/webresources/cancel', //192.168.43.203
      payload, {headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }

}