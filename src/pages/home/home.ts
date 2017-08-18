import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { AddPedidoPage } from '../pedido/add-pedido/add-pedido';
import { PedidoDetallePage } from '../pedido/pedido-detalle/pedido-detalle';

import { AuthService } from '../../services/auth.service';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  pedidos = [];

  constructor(public navController: NavController, public authService: AuthService, public pedidoService: PedidoService) {

  }

  ngOnInit() {
    this.pedidos = this.pedidoService.getPedidos();
  }

  ionViewCanEnter() {
    if (!this.authService.isAuthenticated()) {
      this.navController.setRoot(LoginPage);
    }
  }

  onAddClicked() {
    this.navController.push(AddPedidoPage);
  }

  onDetalleClicked(pedido: any) {
    this.navController.push(PedidoDetallePage, {pedido: pedido});
  }
}
