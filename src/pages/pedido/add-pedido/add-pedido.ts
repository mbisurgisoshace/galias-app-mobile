import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { LoginPage } from '../../login/login';
import { BuscarClientePage } from '../buscar-cliente/buscar-cliente';
import { BuscarArticuloPage } from '../buscar-articulo/buscar-articulo';

import { AuthService } from '../../../services/auth.service';
import { PedidoService } from '../../../services/pedido.service';
import { ClienteService } from '../../../services/cliente.service';

import { Pedido } from '../../../models/pedido.model';
import { Cliente } from '../../../models/cliente.model';

import * as moment from 'moment';

@Component({
  selector: 'page-add-pedido',
  templateUrl: 'add-pedido.html',
})
export class AddPedidoPage implements OnInit {
  cliente: Cliente;
  comentario: string;
  items: any[] = [];

  constructor(public navController: NavController, public authService: AuthService, public pedidoService: PedidoService, public clienteService: ClienteService, public modalController: ModalController, public geolocation: Geolocation, public loadingController: LoadingController, public alertController: AlertController, public toastController: ToastController) {
  }

  ngOnInit() {

  }

  ionViewCanEnter() {
    if (!this.authService.isAuthenticated()) {
      this.navController.setRoot(LoginPage);
    }
  }

  ionViewDidEnter() {
    let loadingEnviando;

    this.pedidoService.isLoading.subscribe((isLoading) => {
      if (isLoading) {
        if (!loadingEnviando) {
          loadingEnviando = this.loadingController.create({
            content: 'Enviando...'
          });
        }

        loadingEnviando.present();
      } else {
        if (loadingEnviando) {
          loadingEnviando.dismiss();
          loadingEnviando = null;
        }
      }
    });

    let loadingLocalizando;

    this.clienteService.isUpdating.subscribe((isUpdating) => {
      if (isUpdating) {
        if (!loadingLocalizando) {
          loadingLocalizando = this.loadingController.create({
            content: 'Localizando...'
          });
        }

        loadingLocalizando.present();
      } else {
        if (loadingLocalizando) {
          loadingLocalizando.dismiss();
          loadingLocalizando = null;
        }
      }
    });
  }

  onBuscarClicked() {
    const modal = this.modalController.create(BuscarClientePage);

    modal.present();

    modal.onDidDismiss((cliente: Cliente) => {
      this.cliente = cliente;
    });
  }

  onLocationClicked() {
    this.clienteService.updateClienteLocation(this.cliente);
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

  onEditClicked(index: number) {
    const prompt = this.alertController.create({
      title: 'Editar',
      message: 'Ingrese la cantidad',
      inputs: [
        {
          name: 'cantidad',
          placeholder: 'Cantidad'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.cantidad === '' || data.cantidad === null) {
              return;
            }

            this.items[index].cantidad = data.cantidad;
          }
        }
      ]
    });

    prompt.present();
  }

  onRemoveClicked(index: number) {
    this.items.splice(index, 1);
  }

  onConfirmarClicked() {
    let pedido: Pedido;

    let fecha = moment().format('DD/MM/YYYY');
    let cliente = this.cliente;
    let comentario = this.comentario;
    let items = this.items;
    let total = this.items
      .map((item) => {
        return item.cantidad * item.precio;
      }).reduce((total, subtotal) => {
        return total + subtotal;
      });
    let estado = 'generado';

    pedido = { fecha: fecha, cliente: cliente, comentario: comentario, items: items, total: total, estado: estado, enviado: false }

    this.pedidoService.addPedido(pedido);

    const alert = this.alertController.create({
      title: 'Enviar',
      message: 'Desea enviar el pedido ahora?',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            this.pedidoService.syncPedido(pedido).subscribe((ped) => {
              console.log(ped);
              const toast = this.toastController.create({
                message: 'Pedido enviado con ID: ' + ped.pedido._id,
                duration: 5000
              });

              toast.present();
              this.navController.pop();
            }, (err) => {
              const toast = this.toastController.create({
                message: 'No se ha podido enviar el pedido.',
                duration: 5000
              });

              toast.present();
              this.navController.pop();
            });
          }
        },
        {
          text: 'No',
          handler: () => {
            this.navController.pop();
          },
          role: 'cancel'
        }
      ]
    })

    alert.present();
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

    this.items.push({ articulo: item.articulo, cantidad: item.promo.promo.cantidadA, precio: precio, promocion: 'A+B', extra: item.promo.promo.extra });
    this.items.push({ articulo: item.articulo, cantidad: item.promo.promo.cantidadB, precio: 0, promocion: 'A+B', extra: item.promo.promo.extra });
  }

  private promocionTipo2(item: any) {
    let precio = 0;

    if (item.articulo.precios.length > 0) {
      precio = item.articulo.precios[0].precio;
    }

    this.items.push({ articulo: item.articulo, cantidad: item.promo.promo.cantidad, descuento: item.promo.promo.porcentaje, precio: precio * (1 - (item.promo.promo.porcentaje / 100)), promocion: 'Descuento', extra: item.promo.promo.extra });
  }

  private promocionTipo3(item: any) {
    let precio = 0;

    if (item.articulo.precios.length > 0) {
      precio = item.articulo.precios[0].precio;
    }

    this.items.push({ articulo: item.articulo, cantidad: item.promo.promo.cantidad, precio: precio, promocion: 'Sin Promocion', extra: item.promo.promo.extra });
  }
}
