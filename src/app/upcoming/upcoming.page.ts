import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api/api.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.page.html',
  styleUrls: ['./upcoming.page.scss'],
})
export class UpcomingPage implements OnInit {
  id : any ;
  page : any ;
  appointments: any;
  constructor(
    private actRoute : ActivatedRoute,
    private api : ApiService,
    private alertController: AlertController,
    private navCtrl : NavController
  ) { 
    this.id = this.actRoute.snapshot.params['id']
    this.page = this.actRoute.snapshot.params['page']
    console.log("ID:",this.id)
    console.log("Page:",this.page)
  }

  async ngOnInit() {
  this.getAppointments()
  }

  async getAppointments(){
    let appointments = await this.api.getAppointments({id:this.id,page:this.page});
    console.log({appointments})
    this.appointments = appointments['data']
    console.log("Appointments:",this.appointments)
  }

  async cancelAppointment(appointment:any){
    console.log({appointment});
    const alert = await this.alertController.create({
      header: 'Confirmation!',
      message : 'Are you sure cancel this Appointment?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: async () => {
            // this.handlerMessage = 'Alert canceled';
            // let res :any =await this.api.changeAppointment(appointment);
            // console.log(res);
          },
        },
        {
          text: 'Sure',
          role: 'confirm',
          handler: async () => {
            // this.handlerMessage = 'Alert confirmed';
            let res :any =await this.api.changeAppointment(appointment);
            console.log(res);
            if(res.status){
              this.getAppointments()
            }
          },
        },
      ],
    });

    await alert.present();

    // const { role } = await alert.onDidDismiss();
    // this.roleMessage = `Dismissed with role: ${role}`;

  }

  async goBack(){
    this.navCtrl.pop()
  }

}
