import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from '../api/user.service';
import { Storage } from '@ionic/storage';
import { timer, of } from 'rxjs';
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

  public name = '';
  public password = '';
  public isSubmit = false;

  ngOnInit() {
    this.menuController.enable(false, 'main');
    this.menuController.enable(false, 'admin');
  }

  ionViewWillEnter() {
    this.menuController.enable(false, 'main');
    this.menuController.enable(false, 'admin');
  }

  ionViewWillLeave() {
    this.isSubmit = false;
  }

  onSubmit() {
    this.isSubmit = true;
    
    this.userService.User({user: {name: this.name, password: this.password}}).subscribe(data => {
      this.storage.set('user', data);
      timer(500).subscribe(() => {
        if (data['response']) {
          this.router.navigate(['/search']);
        } else {
          this.AlertMessage('Usuário ou senha inválidos');
        }
      });
    });
  }

  async AlertMessage(data) {
    const alert = await this.alertController.create({ message: data });
    await alert.present();
    await of(true).pipe(delay(2500)).toPromise();
    await alert.dismiss();
    this.isSubmit = false;
  }

}
