import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  name: any;
  mobile: any;
  email: any;

  constructor(
    private locationStrategy: LocationStrategy ,
    private router : Router,
    private navController : NavController
  ) { }

  ngOnInit() {
    this.name = localStorage.getItem('name')
    this.mobile = localStorage.getItem('mobile')
    this.email = localStorage.getItem('email')
  }

  goBack(){
    this.locationStrategy.back();
  }

  logout(){
    localStorage.clear();
    this.navController.navigateRoot('login')
  }

}
