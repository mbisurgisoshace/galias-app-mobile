import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-pedido-detalle',
  templateUrl: 'pedido-detalle.html',
})
export class PedidoDetallePage implements OnInit {
  pedido: any;

  constructor(public navController: NavController, public navParams: NavParams) {
  }

  ngOnInit() {
    this.pedido = this.navParams.get('pedido');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PedidoDetallePage');
  }

}
