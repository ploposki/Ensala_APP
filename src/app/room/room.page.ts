import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {

  constructor(
    private menuController: MenuController
  ) { }

  ngOnInit() {
    this.menuController.enable(true, 'admin');
  }

}
