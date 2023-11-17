import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

import { LocalNotifications , ScheduleOptions  } from '@capacitor/local-notifications';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  name: any;
  mobile: any;
  email: any;
  ids: any = [];

  constructor(
    private locationStrategy: LocationStrategy ,
    private router : Router,
    private navController : NavController
  ) { }

  ngOnInit() {
    this.name = localStorage.getItem('name')
    this.mobile = localStorage.getItem('mobile')
    this.email = localStorage.getItem('email')
    console.log("Profile Page")
    this.LocalNotification()
    // setInterval(()=>{
    // console.log("Interval")

    //   this.schedule();
    // },1000)

  }

  goBack(){
    this.locationStrategy.back();
  }

  logout(){
    localStorage.clear();
    this.navController.navigateRoot('login')
  }


  async LocalNotification(){
    const prompt = await LocalNotifications.requestPermissions()
    await this.schedule()
    // const permissions : any = await LocalNotifications.checkPermissions();
    // console.log({permissions})
    // if (!permissions.granted) {
    //   // Local notifications are not enabled, prompt the user
    // } else {
    //   const prompt = await LocalNotifications.requestPermissions()
    //   console.log({prompt})
    // }
  }


  schedule(){
    console.log("Schedule")
    var t = new Date();
    t.setSeconds(t.getSeconds() + 5);
    let id = this.ids.length;
    this.ids.push(id);

    let options : ScheduleOptions = { notifications: [{
      id: id,
      title: "Local Notification id = " +id,
      body: "Local Notification Body"
    }] }

    LocalNotifications.schedule(options).then((res)=>{
      console.log({res})
    })
  }

}
