import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    public httpClient: HttpClient
  ) { }

  User(payload: {user: {name, password}}) {
    return this.httpClient.post('http://192.168.1.9:8080/api/webresources/user', //192.168.43.203
      payload, {headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }

}
