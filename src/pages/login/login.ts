import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, LoadingController, AlertController } from 'ionic-angular';

import { HomePage } from '../home/home';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  constructor(public navController: NavController, public authService: AuthService, public loadingController: LoadingController, public alertController: AlertController) {
  }

  onLoginClicked(form: NgForm) {
    const loading = this.loadingController.create({
      content: 'Iniciando sesion...'
    });

    loading.present();

    this.authService.logIn(form.value.username, form.value.password)
      .subscribe((err) => {
        if (err) {
          loading.dismiss();

          const alert = this.alertController.create({
            title: 'Inicio de sesion fallido',
            subTitle: this.errorHandler(err.message),
            buttons: ['Ok']
          });

          alert.present();
        } else {
          loading.dismiss();
          this.navController.setRoot(HomePage);
        }
      });
  }

  errorHandler(error: string) {
    switch (error) {
      case 'User does not exist.':
        return 'El usuario no existe';
      case 'Incorrect username or password.':
        return 'El usuario o la contraseña son incorrectos';
      default:
        return error;
    }
  }
}
