import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { AddPedidoPage } from '../pedido/add-pedido/add-pedido';
import { PedidoDetallePage } from '../pedido/pedido-detalle/pedido-detalle';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  pedidos = [
    {numero: '135752', cliente: 'Maximiliano Bisurgi', enviado: true},
    {numero: '452761', cliente: 'Claudio Bisurgi', enviado: false},
    {numero: '542126', cliente: 'Matias Bisurgi', enviado: false}
  ]

  constructor(public navController: NavController, public authService: AuthService) {

  }

  ionViewCanEnter() {
    if (!this.authService.authenticated()) {
      this.navController.push(LoginPage);
    }
  }

  onAddClicked() {
    this.navController.push(AddPedidoPage);
  }

  onDetalleClicked(pedido: any) {
    this.navController.push(PedidoDetallePage, {pedido: pedido});
  }
}
