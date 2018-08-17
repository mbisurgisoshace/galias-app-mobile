import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

import { AuthService } from './../services/auth.service';
import { PedidoService } from '../services/pedido.service';
import { ClienteService } from '../services/cliente.service';
import { ArticuloService } from '../services/articulo.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('nav') navController: NavController;
  rootPage: any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public authService: AuthService, public menuController: MenuController, public storage: Storage, public pedidoService: PedidoService, public clienteService: ClienteService, public articuloService: ArticuloService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    console.log('init app');

    this.authService.isAuthenticated()
      .subscribe((isAuthenticated) => {
        console.log('isAuthenticated', isAuthenticated);
        if (isAuthenticated) {
          this.rootPage = HomePage;
        } else {
          this.rootPage = LoginPage;
        }
      });
  }

  onCerrarDiaClicked() {
    this.storage.remove('pedidos')
      .then(() => {
        this.pedidoService.removePedidos();
        this.menuController.close();
      });
  }

  onSincronizarClicked() {
    this.clienteService.syncClientes()
      .subscribe(() => {
        
      });

    this.articuloService.syncArticulos()
      .subscribe(() => {

      });
  }

  onCerrarSesionClicked() {
    this.authService.logOut();
    this.navController.setRoot(LoginPage);
    this.menuController.close();
  }
}

