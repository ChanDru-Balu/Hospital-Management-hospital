import { Component } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  hospitals: any = [];
  source: any = [];
  char: any;

  constructor(
    private api : ApiService,
    private router : Router,
    private loadingController : LoadingController
  ) {}

  async getProfile(){
    this.router.navigate(['profile'])
  }

  async ionViewWillEnter(){

    const loading = await this.loadingController.create();
    await loading.present();

    let hospitals = await this.api.getHospitals();
    this.source = [...hospitals]
    this.hospitals = [...hospitals]
    console.log({hospitals})
    console.log("Hospitals:",this.hospitals)

    await loading.dismiss();
  }

  async searchHospitals(ev:any){
    console.log({ev});
    this.char = ev.detail.value;
    this.hospitals = this.source.filter((hospital:any)=>{
      return hospital.name.toLowerCase().indexOf(this.char.toLowerCase()) > -1
    })
  }

  async openHospital(hospital:any){
    console.log('Hospital in Home Page:',hospital)
    await this.router.navigate(['/hospital'], {
      queryParams: {
        hospitalId: hospital.id,
        hospitalName: hospital.name
      }
    });
  }


}
