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

  

  constructor(
    private route  : ActivatedRoute,
    private router : Router,
    private api : ApiService,
    private loadingController : LoadingController,
    private alertController : AlertController,
    private toastController: ToastController
  ) { }

  
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
    this.route.queryParamMap.subscribe((params) => {
      console.log({params})
      const hospitalName = params.get('hospitalName');
      const hospitalId = params.get('hospitalId');
      if (hospitalId) {
        console.log({hospitalId}); // This will log Hospital ID
        this.hospitalId = hospitalId
        this.hospitalName = hospitalName
      }
    });  
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
