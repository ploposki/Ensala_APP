import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from '../api/user.service';
import { Storage } from '@ionic/storage';
import { Subscription, timer, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private userService: UserService,
    private alertController: AlertController,
    private menuController: MenuController,
    private router: Router,
    private storage: Storage
  ) { }

  public subscriptions: Subscription[] = [];

  public name = '';
  public password = '';
  public isSubmit = false;

  ngOnInit() {
    this.menuController.enable(false, 'main');
    this.menuController.enable(false, 'admin');
  }

  ionViewWillEnter() {
    this.storage.set('user', null);
    this.menuController.enable(false, 'main');
    this.menuController.enable(false, 'admin');
  }

  ionViewWillLeave() {
    this.isSubmit = false;
    this.subscriptions.forEach(it => it.unsubscribe());
  }

  onSubmit() {
    this.isSubmit = true;

    this.subscriptions.push(timer(5000).subscribe(() => {
      this.AlertMessage('Sessão expirada');
      this.router.navigate(['/login']);
      this.subscriptions.forEach(it => it.unsubscribe());
    }));

    this.subscriptions.push(this.userService.User({user: {name: this.name, password: this.password}}).subscribe(data => {
      this.storage.set('user', data);
      this.subscriptions.push(timer(500).subscribe(() => {
        if (data['response']) {
          this.router.navigate(['/search']);
        } else {
          this.AlertMessage('Usuário ou senha inválidos');
          this.subscriptions.forEach(it => it.unsubscribe());
        }
      }));
    }));
  }

  async AlertMessage(data) {
    const alert = await this.alertController.create({ message: data });
    await alert.present();
    await of(true).pipe(delay(2500)).toPromise();
    await alert.dismiss();
    this.isSubmit = false;
  }

}
