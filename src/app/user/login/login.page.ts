import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";
import {AlertController, LoadingController} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentials = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        console.log('GOT USER ON LOGIN');
        this.router.navigateByUrl('/', { replaceUrl: true });
      }
    });
  }

  get email() { return this.credentials.get('email') }

  get password() { return this.credentials.get('password') }

  ngOnInit() {
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.signIn(this.credentials.getRawValue()).then(
      async (data) => {
        await loading.dismiss();
        if (data.error) {
          this.showAlert('Error de login', data.error.message)
        }
      }
    )
  }


  async showAlert(title: string, msg: string) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async forgotPassword() {
    const alert = await this.alertController.create({
      header: 'Recupera tu contraseña',
      message: 'Ingresa tu email',
      inputs: [
        {
          type: 'email',
          name: 'email',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Reiniciar contraseña',
          handler: async (result) => {
            const loading = await this.loadingController.create();
            await loading.present();
            const { data, error } = await this.authService.sendPasswordResetEmail(result.email);
            await loading.dismiss();

            if (error) {
              this.showAlert('Failed', error.message);
            } else {
              this.showAlert('Success', 'Please check your emails for further instructions!');
            }
          },
        },
      ],
    });
    await alert.present();
  }







}

