import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LoginPage } from '../../login/login';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'page-pedido-detalle',
  templateUrl: 'pedido-detalle.html',
})
export class PedidoDetallePage implements OnInit {
  pedido: any;

  constructor(public navController: NavController, public navParams: NavParams, public authService: AuthService) {
  }

  ngOnInit() {
    this.pedido = this.navParams.get('pedido');
  }

  ionViewCanEnter() {
    if (!this.authService.isAuthenticated()) {
      this.navController.setRoot(LoginPage);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PedidoDetallePage');
  }

  getTotal() {
    let total = 0;

    for (let i = 0; i < this.pedido.items.length; i++) {
      let item = this.pedido.items[i];

      let subTotal = item.cantidad * item.precio;

      total = total + subTotal;
    }

    return total;
  }
}
