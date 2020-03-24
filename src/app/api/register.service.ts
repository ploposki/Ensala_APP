import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    public httpClient: HttpClient
  ) { }

  Register(payload: {user: {name, password, admin_access}}) {
    return this.httpClient.post('http://192.168.43.203:8080/api/webresources/register',
      payload, {headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }

}
