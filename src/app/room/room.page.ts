import { Component, ViewChild, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SearchService } from '../api/search.service';
import { RoomService } from '../api/room.service';
import { formatDate } from '@angular/common';
import { Subscription, timer, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { format } from 'date-fns';

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {

  event = {
    title: '',
    startTime: '',
    endTime: ''
  };
 
  eventSource = [];
  viewTitle;
 
  calendar = {
    mode: 'month',
    locale: 'en-GB',
    currentDate: new Date(),
  };
 
  @ViewChild(CalendarComponent, { static: true }) myCal: CalendarComponent;
 
  constructor(
    private alertController: AlertController,
    private searchService: SearchService,
    private roomService: RoomService,
    private router: Router,
    private storage: Storage,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  public subscriptions: Subscription[] = [];

  public value = '50px';

  public user;
  public room;
  public reserves;
 
  ngOnInit() {
    this.resetEvent();
  }

  ionViewWillEnter() {
    this.Add();
    this.User();
    this.Loop();
  }

  ionViewWillLeave() {
    this.subscriptions.forEach(it => it.unsubscribe());
  }
 
  resetEvent() {
    this.event = {
      title: '',
      startTime: new Date(new Date().getTime() - (new Date().getTimezoneOffset())).toISOString(),
      endTime: new Date(new Date().getTime() - (new Date().getTimezoneOffset())).toISOString(),
    };
  }

  addEvent() {
    if (format(new Date(this.event.startTime), 'yyyy-MM-dd HH:mm:ss') > format(new Date(), 'yyyy-MM-dd HH:59:59') &&
        format(new Date(this.event.startTime), 'HH:mm:ss') >= format(new Date(), '06:00:00') &&
        format(new Date(this.event.startTime), 'HH:mm:ss') <= format(new Date(), '22:00:00')){
      const reserveDate = format(new Date(this.event.startTime), 'yyyy-MM-dd HH:00:00');
      let roomId;

      this.room.forEach(rm => {
        if (rm[1] === this.event.title) {
          roomId = rm[0]
        }
      });

      this.subscriptions.push(this.roomService.Room({room: {id_user: this.user, id_room: roomId, reserve_date: reserveDate}}).subscribe(data => {
        if (data['response']) {
          const time = new Date(reserveDate);

          let eventCopy = {
            title: this.event.title,
            startTime: new Date(reserveDate),
            endTime: new Date(time.setHours(time.getHours() + 1)),
          }
      
          this.eventSource.push(eventCopy);
          this.myCal.loadEvents();
          this.resetEvent();
          this.AlertMessage("Reserva efetuada com sucesso");
        } else {
          this.AlertMessage("Reserva invalida");
        }
      }));
    } else {
      this.AlertMessage("Reserva expirada");
    }
  }
  
  changeMode(mode) {
    this.calendar.mode = mode;

    if (mode === 'month') {
      this.value = '50px';
    }
    else {
      this.value = '';
    }
  }
  
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
  
  async onEventSelected(event) {
    let start = formatDate(event.startTime, 'HH:mm', this.locale);
    let end = formatDate(event.endTime, 'HH:mm', this.locale);
    let day = formatDate(event.startTime, 'dd/MM/yyyy', this.locale);
  
    const alert = await this.alertController.create({
      header: event.title,
      message: start + ' às ' + end + '<br><br>' + day,
      buttons: ['OK']
    });
    alert.present();
  }
  
  onTimeSelected(ev) {
    let selected = new Date(ev.selectedTime);
    this.event.startTime = selected.toISOString();
    selected.setHours(selected.getHours() + 1);
    this.event.endTime = (selected.toISOString());
  }

  Update() {
    this.subscriptions.push(this.searchService.Search({search: {limit: 100}}).subscribe(data => {
      this.room = data[`search`][`rooms`];
      this.reserves = data[`search`][`reserves`];
    }));
  }

  Loop() {
    this.subscriptions.push(timer(1000, 5000).subscribe(() => {
      this.Update();
    }));
  }

  User() {
    this.storage.get('user').then((u) => {
      this.user = u.user.id_user;
    }).catch(() => {
      this.Exit();
    });
  }

  Exit() {
    this.storage.clear();
    this.router.navigate(['/login']);
  }

  Add() {
    this.subscriptions.push(this.searchService.Search({search: {limit: 100}}).subscribe(data => {
      this.room = data[`search`][`rooms`];
      this.reserves = data[`search`][`reserves`];

      this.reserves.forEach(rv => {
        this.room.forEach(rm => {
          if (rv[1] === rm[0]) {
            const time = new Date(rv[2]);
            
            let event = {
              title: rm[1],
              startTime: new Date(rv[2]),
              endTime: new Date(time.setHours(time.getHours() + 1)),
            }

            this.eventSource.push(event);
            this.myCal.loadEvents();
            this.resetEvent();
          }
        });
      });
    }));
  }

  async AlertMessage(data) {
    const alert = await this.alertController.create({ message: data });
    await alert.present();
    await of(true).pipe(delay(2500)).toPromise();
    await alert.dismiss();
  }
  
}
