import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { LoginPage } from '../../login/login';
import { BuscarClientePage } from '../buscar-cliente/buscar-cliente';
import { BuscarArticuloPage } from '../buscar-articulo/buscar-articulo';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'page-add-pedido',
  templateUrl: 'add-pedido.html',
})
export class AddPedidoPage {
  cliente: any;
  items: any[] = [];

  constructor(public navController: NavController, public authService: AuthService, public modalController: ModalController) {
  }

  ionViewCanEnter() {
    if (!this.authService.isAuthenticated()) {
      this.navController.setRoot(LoginPage);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPedidoPage');
  }

  onBuscarClicked() {
    const modal = this.modalController.create(BuscarClientePage);

    modal.present();

    modal.onDidDismiss((cliente: any) => {
      console.log(cliente);
      this.cliente = cliente;
    });
  }

  onAddClicked() {
    const modal = this.modalController.create(BuscarArticuloPage);

    modal.present();

    modal.onDidDismiss((item) => {
      if (item.promo.tipo === 1) {
        this.promocionTipo1(item);
      }

      if (item.promo.tipo === 2) {
        this.promocionTipo2(item);
      }

      if (item.promo.tipo === 3) {
        this.promocionTipo3(item);
      }
    });
  }

  onRemoveClicked(index: number) {
    this.items.splice(index, 1);
  }

  promocionTipo1(item: any) {
    this.items.push({articulo: item.articulo.descripcion, cantidad: item.promo.promo.cantidadA, precio: item.articulo.precio});
    this.items.push({articulo: item.articulo.descripcion, cantidad: item.promo.promo.cantidadB, precio: 0});
  }

  promocionTipo2(item: any) {
    this.items.push({articulo: item.articulo.descripcion, cantidad: item.promo.promo.cantidad, precio: item.articulo.precio * (1 - (item.promo.promo.porcentaje / 100))});
  }

  promocionTipo3(item: any) {
    this.items.push({articulo: item.articulo.descripcion, cantidad: item.promo.promo.cantidad, precio: item.articulo.precio});
  }
}
