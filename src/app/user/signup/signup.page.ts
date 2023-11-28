import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { LoadingController, AlertController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

export class SignupPage implements OnInit {
  credentials = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private navCtrl: NavController
  ) { }

  get email() {
    return this.credentials.controls.email;
  }

  get password() {
    return this.credentials.controls.password;
  }

  ngOnInit() {
  }

  async createAccount() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.signUp(this.credentials.getRawValue()).then(async (data) => {
      await loading.dismiss();
      console.log('data: ', data);

      if (data.error) {
        this.showAlert('Registro fallido', data.error.message);
      } else {
        this.showAlert('¡Registro exitoso!', 'Por favor revisar su email ahora');
        this.navCtrl.navigateBack('');
      }
    });
  }

  async showAlert(title: string, msg: string) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }

}


