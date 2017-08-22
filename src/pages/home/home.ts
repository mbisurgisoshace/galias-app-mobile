import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { AddPedidoPage } from '../pedido/add-pedido/add-pedido';
import { PedidoDetallePage } from '../pedido/pedido-detalle/pedido-detalle';

import { AuthService } from '../../services/auth.service';
import { PedidoService } from '../../services/pedido.service';
import { ArticuloService } from '../../services/articulo.service';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  pedidos = [];

  constructor(public navController: NavController, public authService: AuthService, public pedidoService: PedidoService, public articuloService: ArticuloService, public clienteService: ClienteService, public loadingController: LoadingController) {

  }

  ngOnInit() {
    console.log('HomePage ngOnInit()');

    const loadingArt = this.loadingController.create({
      content: 'Cargando articulos...'
    });

    const loadingCli = this.loadingController.create({
      content: 'Cargando clientes...'
    });

    this.articuloService.isLoading.subscribe((isLoading) => {
      if (isLoading) {
        loadingArt.present();
      } else {
        loadingArt.dismiss();
      }
    });

    this.clienteService.isLoading.subscribe((isLoading) => {
      if (isLoading) {
        loadingCli.present();
      } else {
        loadingCli.dismiss();
      }
    });
  }

  ionViewCanEnter() {
    if (!this.authService.isAuthenticated()) {
      this.navController.setRoot(LoginPage);
    }
  }

  ionViewDidEnter() {
    console.log('HomePage ionViewDidEnter()');
    this.pedidos = this.pedidoService.getPedidos();
  }

  onAddClicked() {
    this.navController.push(AddPedidoPage);
  }

  onDetalleClicked(pedido: any) {
    this.navController.push(PedidoDetallePage, {pedido: pedido});
  }
}
