import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  constructor(
    private menuController: MenuController,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.storage.get('user').then(u => {
      if (u.user.admin_access === 1) {
        this.menuController.enable(true, 'admin');
      }
      else {
        this.menuController.enable(true, 'main');
      }
    });
  }

}
