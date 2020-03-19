import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public selectedIndex = 0;
  public name = '';

  public appPagesMain = [
    {
      title: 'Minhas Reservas',
      url: '/search',
      icon: 'search'
    },
    {
      title: 'Reservar Local',
      url: '/room',
      icon: 'golf'
    },
  ];

  public appPagesAdmin = [
    {
      title: 'Minhas Reservas',
      url: '/search',
      icon: 'search'
    },
    {
      title: 'Cadastrar Usuário',
      url: '/register',
      icon: 'person-add'
    },
    {
      title: 'Reservar Local',
      url: '/room',
      icon: 'golf'
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private storage: Storage
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.storage.set('user', null);
      this.Loop();
    });
  }

  Loop() {
    const header = timer(1000, 1000).subscribe(() => {
      this.storage.get('user').then(u => {
        if (u === null) {
          this.name = '';
        }
        else {
          this.name = u.user.name;
          header.unsubscribe();
        }
      });
    });
  }

}
