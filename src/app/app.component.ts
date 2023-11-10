import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private navController : NavController
  ) {
    const id = localStorage.getItem('id')
    console.log({id})
    if(id){
      this.navController.navigateRoot('home')
    } else {
      this.navController.navigateRoot('login')

    }
  }



}
