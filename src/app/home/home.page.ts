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
  appointments: any;
  id: string | any;
  page : any = 'upcoming'

  constructor(
    private api : ApiService,
    private router : Router,
    private loadingController : LoadingController
  ) {}

  async getProfile(){
    this.router.navigate(['profile'])
  }

  async ionViewWillEnter(){
    this.getAppointments()
  }

  async getAppointments(){
    const loading = await this.loadingController.create();
    await loading.present();

    this.id = localStorage.getItem('id')

    let appointments = await this.api.getAppointments({id:this.id,page:this.page});
    console.log({appointments})
    this.appointments = appointments ? appointments['data'] : []
    console.log("appointments:",this.appointments)

    await loading.dismiss();
  }

  async segmentChanged(ev:any){
    console.log({ev});
    this.page =await ev.detail.value;
    this.getAppointments()
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
