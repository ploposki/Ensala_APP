import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RegisterService } from '../api/register.service';
import { Subscription, timer, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(
    private registerService: RegisterService,
    private alertController: AlertController,
    private router: Router
  ) { }

  public subscriptions: Subscription[] = [];

  public name = '';
  public password = '';
  public check = false;
  public isSubmit = false;

  ngOnInit() { 
    this.isSubmit = false;
  }

  ionViewWillEnter() {
    this.isSubmit = false;
  }

  ionViewWillLeave() {
    this.isSubmit = false;
    this.subscriptions.forEach(it => it.unsubscribe());
  }

  onSubmit() {
    this.isSubmit = true;

    let access = 0;
    if(this.check){
      access = 1;
    }
    else {
      access = 0;
    }

    this.subscriptions.push(timer(5000).subscribe(() => {
      this.AlertMessage('Sessão expirada');
      this.router.navigate(['/login']);
      this.subscriptions.forEach(it => it.unsubscribe());
    }));

    this.subscriptions.push(this.registerService.Register({user: {name: this.name, password: this.password, admin_access: access}}).subscribe(data => {
      if (data['response']) {
        this.AlertMessage('Usuário cadastrado com sucesso');
        this.subscriptions.forEach(it => it.unsubscribe());
      } else {
        this.AlertMessage('Cadastro invalido');
        this.subscriptions.forEach(it => it.unsubscribe());
      }
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
