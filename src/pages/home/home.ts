import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { AddPedidoPage } from '../pedido/add-pedido/add-pedido';
import { PedidoDetallePage } from '../pedido/pedido-detalle/pedido-detalle';

import { AuthService } from '../../services/auth.service';
import { PedidoService } from '../../services/pedido.service';
import { ArticuloService } from '../../services/articulo.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  pedidos = [];

  constructor(public navController: NavController, public authService: AuthService, public pedidoService: PedidoService, public articuloService: ArticuloService, public loadingController: LoadingController) {

  }

  ngOnInit() {
    const loading = this.loadingController.create({
      content: 'Cargando articulos...'
    });

    this.articuloService.isLoading.subscribe((isLoading) => {
      if (isLoading) {
        loading.present();
      } else {
        loading.dismiss();
      }
    });
    
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
