import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(
    public httpClient: HttpClient
  ) { }

  Room(payload: {room: {id_user, id_room, reserve_date}}) {
    return this.httpClient.post('http://192.168.1.9:8080/api/webresources/room', //192.168.43.203
      payload, {headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }

}