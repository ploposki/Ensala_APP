import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SearchService } from '../api/search.service';
import { CancelService } from '../api/cancel.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { format } from 'date-fns';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  constructor(
    private alertController: AlertController,
    private menuController: MenuController,
    private searchService: SearchService,
    private cancelService: CancelService,
    private router: Router,
    private storage: Storage
  ) { }

  public subscriptions: Subscription[] = [];

  public user;
  public room;
  public reserves;
  public search;
  public result;

  ngOnInit() {
    this.menuController.enable(false, 'admin');
    this.menuController.enable(false, 'main');
  }

  ionViewWillEnter() {
    this.Navbar();
    this.Update();
  }

  ionViewWillLeave() {
    this.subscriptions.forEach(it => it.unsubscribe());
  }

  Navbar() {
    this.storage.get('user').then(u => {
      this.user = u.user;
      if (u.user.admin_access === 1) {
        this.menuController.enable(true, 'admin');
      }
      else {
        this.menuController.enable(true, 'main');
      }
    }).catch(() => {
      this.Exit();
    });
  }

  Update() {
    this.subscriptions.push(this.searchService.Search({search: {limit: 100}}).subscribe(data => {
      this.room = data[`search`][`rooms`];
      this.reserves = data[`search`][`reserves`];

      let array = [];

      this.storage.get('user').then(u => {
        this.reserves.forEach(rv => {
          this.room.forEach(rm => {
            if (rv[2] === rm[0]) {
              const time = new Date(rv[3]);

              rv[2] = rm[1];
              rv[7] = format(new Date(rv[3]), 'dd/MM/yyyy');
              rv[8] = format(new Date(rv[3]), 'HH') + 'h às ' + 
                      format(new Date(time.setHours(time.getHours() + 1)), 'HH') + 'h';

              if (u.user.admin_access == 0 && u.user.id_user == rv[1]) {
                array.push(rv);
              }
            }
          });
        });

        if (this.user.admin_access === 0) {
          this.reserves = array;
        }
      });
    }));
  }

  Exit() {
    this.storage.clear();
    this.router.navigate(['/login']);
  }

  async Selected(event) {
  
    const alert = await this.alertController.create({
      header: event[2],
      message: event[8] + '<br><br>' + event[7],
      buttons: [
        {
          text: 'CANCELAR RESERVA',
          handler: () => {
            const at = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
            this.subscriptions.push(this.cancelService.Cancel({room: {id_reserve: event[0], canceled_at: at}}).subscribe(() => {
              this.AlertMessage('Reserva cancelada');
              this.Update();
            }));
          }
        }
      ]
    });
    alert.present();
  }

  async Search(event) {
    let input = '';
    let array = [];
    input += event.target.value;

    this.reserves.forEach(rv => {
      if (rv[0].includes(input) ||
          rv[2].toUpperCase().includes(input) || rv[2].toLowerCase().includes(input) ||
          rv[7].toUpperCase().includes(input) || rv[7].toLowerCase().includes(input) ||
          rv[8].toUpperCase().includes(input) || rv[8].toLowerCase().includes(input)) {

        array.push(rv);
      }
    });

    this.result = array;

    if (input == '') {
      this.result = null;
    }
  }

  async AlertMessage(data) {
    const alert = await this.alertController.create({ message: data });
    await alert.present();
    await of(true).pipe(delay(2500)).toPromise();
    await alert.dismiss();
  }

}
