import { Component, OnInit ,ViewChild } from '@angular/core';
import { AlertController, IonModal, LoadingController, ToastController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api/api.service';

@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.page.html',
  styleUrls: ['./hospital.page.scss'],
})
export class HospitalPage implements OnInit {

  @ViewChild(IonModal) modal: IonModal | any;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: string | any;
  
  hospitalId: any;
  hospitalName: any;
  patientName :any;
  patientAge : any;
  time: any;
  gender : any;
  treatment:any;
  date: any;
  description: any;
  id: any;
  appointments: any;

  

  constructor(
    private route  : ActivatedRoute,
    private router : Router,
    private api : ApiService,
    private loadingController : LoadingController,
    private alertController : AlertController,
    private toastController: ToastController
  ) { }


  // Sandbox Started

  
  // validateDateAndTime(ev: any) {
  //   const dateString = ev.detail.value;
  //   console.log({dateString}) 
  //   const date = new Date(dateString);
  //   const hour = date.getHours();
  //   const minute = date.getMinutes();
    
  //   // Prevent the user from selecting the 1.59AM option.
  //   return (hour !== 1 || minute !== 59) && (date.getDay() !== 0 && date.getDay() !== 6) && (minute >= 0 && minute < 60);
  //   }
    



  // andBox End
  
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }


  ngOnInit() {
    this.route.queryParamMap.subscribe((params:any) => {
      console.log({params})
      const userId = params.get('userId');
      console.log({userId})
      // this.getPatientAppointments(appointment);
    });  
  }

  async getPatientAppointments(userId:any){
    console.log({userId})

    const loading = await this.loadingController.create();
    await loading.present();

    this.id = userId;

    let appointments = await this.api.getPatientAppointments({id:this.id});
    console.log({appointments})
    this.appointments = appointments ? appointments['data'] : []
    console.log("PatientAppointments:",this.appointments)

    await loading.dismiss();
  }

  async getProfile(){
    this.router.navigate(['profile'])
  }

  async newAppointment(){
    let data = {
      userId : localStorage.getItem('id'),
      hospitalName : this.hospitalName,
      hospitalId : this.hospitalId,
      time : this.time,
      date : this.date,
      patientName : this.patientName,
      patientAge : this.patientAge,
      gender : this.gender,
      treatment : this.treatment,
      description : this.description,
      status : 0
    }
    console.log({data})
    const loading = await this.loadingController.create();
    await loading.present();

    let AppointmentStatus: any = await this.api.addAppointment(data);
    console.log({AppointmentStatus})

    if(!AppointmentStatus.status){
      await loading.dismiss();

      let message : any = 'There is an issue in booking!'

      if(AppointmentStatus.error['code'] == 'invalid-argument') return message = "Check the Given details , You've missed Something!"

      const alert = await this.alertController.create({
        header: 'Appointment Failed',
        message: message
      })
      await alert.present()
      return
    }

    const toast = await this.toastController.create({
      message: 'Your Appointment Booked Successfully!',
      duration: 1500,
    });

    await toast.present();

    await this.modal.dismiss();

    await loading.dismiss();

    return
  }

}
