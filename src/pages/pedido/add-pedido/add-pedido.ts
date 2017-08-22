import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { LoginPage } from '../../login/login';
import { BuscarClientePage } from '../buscar-cliente/buscar-cliente';
import { BuscarArticuloPage } from '../buscar-articulo/buscar-articulo';

import { AuthService } from '../../../services/auth.service';
import { PedidoService } from '../../../services/pedido.service';

import { Pedido } from '../../../models/pedido.model';
import { Cliente } from '../../../models/cliente.model';

import * as moment from 'moment';

@Component({
  selector: 'page-add-pedido',
  templateUrl: 'add-pedido.html',
})
export class AddPedidoPage {
  cliente: Cliente;
  items: any[] = [];

  constructor(public navController: NavController, public authService: AuthService, public pedidoService: PedidoService, public modalController: ModalController, public geolocation: Geolocation, public loadingController: LoadingController) {
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

    modal.onDidDismiss((cliente: Cliente) => {
      console.log(cliente);
      this.cliente = cliente;
    });
  }

  onLocationClicked() {
    const loading = this.loadingController.create({
      content: 'Localizando...'
    });

    loading.present();

    this.geolocation.getCurrentPosition()
      .then((location) => {
        loading.dismiss();
        console.log(location);
      })
      .catch((err) => {
        loading.dismiss();
        console.log(err);
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

  onConfirmarClicked() {
    let pedido: Pedido;

    let fecha = moment().format('DD/MM/YYYY');
    let cliente = this.cliente;
    let items = this.items;
    let total = this.items
      .map((item) => {
        return item.cantidad * item.precio;
      }).reduce((total, subtotal) => {
        return total + subtotal;
      });
    let estado = 'generado';

    pedido = { fecha: fecha, cliente: cliente, items: items, total: total, estado: estado, enviado: false }

    this.pedidoService.addPedido(pedido);

    this.navController.pop();
  }

  isDisabled() {
    if (!this.cliente || this.items.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  private promocionTipo1(item: any) {
    let precio = 0;

    if (item.articulo.precios.length > 0) {
      precio = item.articulo.precios[0].precio;
    }

    this.items.push({ articulo: item.articulo, cantidad: item.promo.promo.cantidadA, precio: precio });
    this.items.push({ articulo: item.articulo, cantidad: item.promo.promo.cantidadB, precio: 0 });
  }

  private promocionTipo2(item: any) {
    let precio = 0;

    if (item.articulo.precios.length > 0) {
      precio = item.articulo.precios[0].precio;
    }

    this.items.push({ articulo: item.articulo, cantidad: item.promo.promo.cantidad, precio: precio * (1 - (item.promo.promo.porcentaje / 100)) });
  }

  private promocionTipo3(item: any) {
    let precio = 0;

    if (item.articulo.precios.length > 0) {
      precio = item.articulo.precios[0].precio;
    }

    this.items.push({ articulo: item.articulo, cantidad: item.promo.promo.cantidad, precio: precio });
  }
}
