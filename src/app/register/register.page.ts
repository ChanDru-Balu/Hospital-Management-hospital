import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  credentials? : FormGroup ;

  constructor(
    private auth : AuthService,
    private router: Router,
    private alertController : AlertController,
    private loadingController : LoadingController,
    private fb: FormBuilder,
    private toast: ToastController,
    private locationStrategy : LocationStrategy
  ) { }

  // Easy Access For form Fields
  get name() {
    return this.credentials?.get('name');
  }

  get mobile() {
    return this.credentials?.get('mobile');
  }

  get email() {
    return this.credentials?.get('email');
  }

  get password() {
    return this.credentials?.get('password');
  }

  get cnfPassword() {
    return this.credentials?.get('cnfPassword');
  }



  ngOnInit() {
    this.credentials = this.fb.group({
      name : ['',[Validators.required,Validators.minLength(4)]],
      mobile : ['',[Validators.required,Validators.minLength(10),Validators.maxLength(10)]],
      email : ['',[Validators.required,Validators.email]],
      password : ['',[Validators.required,Validators.minLength(8)]],
      cnfPassword : ['',[Validators.required,Validators.minLength(8)]]
    })
  }



  async register(){
    console.log("Creds:",this.credentials)
    const loading = await this.loadingController.create();
    await loading.present()

   const user = await this.auth.register(this.credentials?.value)
   console.log({user})

   if(user.status){
    await this.toast.create({
      message:'Registration Successful! Please Login Now'
    })
    this.router.navigate(['login'])
   } else {
    await this.showAlert('Registration Failed',user.message);
   }

   await loading.dismiss()
  }

  async showAlert(header:string,message:string){
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    })
    await alert.present();
  }

  goBack(){
    this.locationStrategy.back();
  }

}
