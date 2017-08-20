import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

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

  constructor(public navController: NavController, public authService: AuthService, public modalController: ModalController, public geolocation: Geolocation, public loadingController: LoadingController) {
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

  promocionTipo1(item: any) {
    let precio = 0;

    if (item.articulo.precios.length > 0) {
      precio = item.articulo.precios[0].precio;
    }

    this.items.push({ articulo: item.articulo.descripcion, cantidad: item.promo.promo.cantidadA, precio: precio });
    this.items.push({ articulo: item.articulo.descripcion, cantidad: item.promo.promo.cantidadB, precio: 0 });
  }

  promocionTipo2(item: any) {
    let precio = 0;

    if (item.articulo.precios.length > 0) {
      precio = item.articulo.precios[0].precio;
    }

    this.items.push({ articulo: item.articulo.descripcion, cantidad: item.promo.promo.cantidad, precio: precio * (1 - (item.promo.promo.porcentaje / 100)) });
  }

  promocionTipo3(item: any) {
    let precio = 0;

    if (item.articulo.precios.length > 0) {
      precio = item.articulo.precios[0].precio;
    }

    this.items.push({ articulo: item.articulo.descripcion, cantidad: item.promo.promo.cantidad, precio: precio });
  }
}
