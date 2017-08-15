import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { LoginPage } from '../../login/login';
import { BuscarClientePage } from '../buscar-cliente/buscar-cliente';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'page-add-pedido',
  templateUrl: 'add-pedido.html',
})
export class AddPedidoPage {

  constructor(public navController: NavController, public authService: AuthService, public modalController: ModalController) {
  }

  ionViewCanEnter() {
    if (!this.authService.authenticated()) {
      this.navController.setRoot(LoginPage);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPedidoPage');
  }

  onBuscarClicked() {
    console.log('onBuscarClicked()');

    const modal = this.modalController.create(BuscarClientePage);

    modal.present();

    modal.onDidDismiss((cliente: any) => {
      console.log(cliente);
    });
  }
}
