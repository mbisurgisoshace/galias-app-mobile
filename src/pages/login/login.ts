import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, LoadingController } from 'ionic-angular';

import { HomePage } from '../home/home';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {
  constructor(public navController: NavController, public authService: AuthService, public loadingController: LoadingController) {
  }

  ngOnInit() {
    this.authService.isAuthenticated()
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.navController.setRoot(HomePage);
        }
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
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
          console.log(err);
        } else {
          loading.dismiss();
          this.navController.setRoot(HomePage);
        }
      });
  }
}
