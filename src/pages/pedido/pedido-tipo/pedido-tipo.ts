import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AddPedidoPage } from '../add-pedido/add-pedido';

import { PedidoService } from '../../../services/pedido.service';

@Component({
  selector: 'page-pedido-tipo',
  templateUrl: 'pedido-tipo.html',
})
export class PedidoTipoPage {
  constructor(public navController: NavController, public navParams: NavParams, public pedidoService: PedidoService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PedidoTipoPage');
  }

  onTipoClicked(extra: boolean) {
    this.pedidoService.getCurrentPedido().extra = extra;
    this.navController.push(AddPedidoPage);
  }
}
