import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

import { AuthService } from './../services/auth.service';
import { ArticuloService } from './../services/articulo.service';
import { ClienteService } from './../services/cliente.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('nav')navController: NavController;
  rootPage: any = LoginPage;
  sincronizando;


  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public authService: AuthService, public menuController: MenuController, public loadingController: LoadingController, public clienteService: ClienteService, public articuloService: ArticuloService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.authService.isAuthenticated()
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.rootPage = HomePage;
        } else {
          this.rootPage = LoginPage;
        }
      });

      this.sincronizando = this.loadingController.create({
        content: 'Sincronizando...'
      });
  }

  onSincronizarClicked() {
    this.clienteService.isLoading.subscribe((isLoading) => {
      if (isLoading) {
        this.sincronizando.present();
      } else {
        this.sincronizando.dismiss();
      }
    });

    this.articuloService.isLoading.subscribe((isLoading) => {
      if (isLoading) {
        this.sincronizando.present();
      } else {
        this.sincronizando.dismiss();
      }
    });

    this.clienteService.syncClientes().subscribe();
    this.articuloService.syncArticulos().subscribe();
  }

  onCerrarSesionClicked() {
    this.authService.logOut();
    this.navController.setRoot(LoginPage);
    this.menuController.close();
  }
}

