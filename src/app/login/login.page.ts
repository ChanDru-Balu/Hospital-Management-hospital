import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: any;

  constructor(
    private auth : AuthService,
    private router : Router,
    private fb: FormBuilder,
    private alertController : AlertController,
    private toastController : ToastController,
    private loadingController : LoadingController
  ) { }

  get email(){
    return this.credentials.email;
  }

  get password(){
    return this.credentials.password;
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      mobile : ['',[Validators.required,Validators.minLength(10),Validators.maxLength(10)]],
      password : ['',[Validators.required,Validators.minLength(8)]]
    })
  }


  async login(){
    console.log(this.credentials.value)
    const loading =  await this.loadingController.create();
    await loading.present();

    const user = await this.auth.login(this.credentials.value);
    console.log({user})
    let data = user.user;
    localStorage.setItem('id',data.id)
    localStorage.setItem('mobile',data.userDetails.mobile)
    localStorage.setItem('email',data.userDetails.email)
    localStorage.setItem('name',data.userDetails.name)
    this.router.navigate(['home'])
    await loading.dismiss();

  }

  goToRegisterPage(){
    console.log("Navigation")
    this.router.navigate(['/','register'])
  }

}
