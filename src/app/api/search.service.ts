import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    public httpClient: HttpClient
  ) { }

  Search(payload: {search: {limit}}) {
    return this.httpClient.post('http://192.168.1.9:8080/api/webresources/search', //192.168.43.203
      payload, {headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }

}