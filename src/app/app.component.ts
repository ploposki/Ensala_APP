import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public selectedIndex = 0;
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
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

}
